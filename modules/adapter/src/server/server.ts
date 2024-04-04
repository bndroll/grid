import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { json } from 'body-parser';
import { Server } from 'http';
import { Adapter } from '../core/adapter';
import { Logger } from '../common/logger/logger';
import { Config } from '../common/config/config';

export class ServerApplication {
	private readonly logger = new Logger(ServerApplication.name);

	private readonly adapter: Adapter;

	private app: Express;
	private server: Server | null = null;
	private port: number = Config.Port;

	constructor() {
		this.app = express();
		this.adapter = Adapter.create();
	}

	run() {
		this.initMiddleware();
		this.initRoutes();

		this.adapter.run();
		this.server = this.app.listen(this.port);

		this.logger.log(`Adapter socket listen on http://${Config.Url}:${this.port}`);
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
				id: req.body.id,
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
