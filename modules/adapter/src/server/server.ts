import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { Server } from 'http';
import { Adapter } from '../core/adapter';
import { Logger } from '../common/logger/logger';
import { Config } from '../common/config/config';

export class ServerApplication {
	private readonly logger = new Logger(ServerApplication.name);

	private app: Express;
	private server: Server | null = null;

	constructor(private readonly adapter: Adapter) {
		this.app = express();
		this.adapter = adapter;
	}

	async run() {
		this.initMiddleware();
		this.initRoutes();

		this.server = this.app.listen(Config.Port);

		this.logger.log(`Adapter socket listen on http://${Config.Url}:${Config.Port}`);
	}

	private initMiddleware(): void {
		this.app.use(cors({origin: true}));
		this.app.use(json());
		this.app.use(express.urlencoded({extended: true}));
	}

	private initRoutes(): void {
		this.app.post('/produce', async (req: Request, res: Response) => {
			await this.adapter.produce({
				distributorId: req.body.distributorId,
				code: req.body.code
			});
			res.send();
		});
		this.app.post('/consume', async (req: Request, res: Response) => {
			const result = await this.adapter.consume({nodeId: req.body.nodeId});
			return res.send(result);
		});
		this.app.post('/update', async (req: Request, res: Response) => {
			const result = await this.adapter.update({
				tid: req.body.tid,
				nodeId: req.body.nodeId,
				distributorId: req.body.distributorId,
				status: req.body.status,
				processing: req.body.processing,
				code: req.body.code,
				result: req.body.result,
				lastUpdated: req.body.lastUpdated
			});
			return res.send(result);
		});
		this.app.post('/find-result', async (req: Request, res: Response) => {
			const result = await this.adapter.findResult({distributorId: req.body.distributorId});
			return res.send(result);
		});
	}
}
