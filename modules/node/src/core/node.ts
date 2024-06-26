import { Logger } from '../common/logger/logger';
import { generateShortId } from '../utils/generate-short-id';
import { Task, TaskStatus } from './models/task.model';
import { HttpService } from '../common/http/http.service';
import { ScheduleConfig } from './types/schedule';
import { ExecFunction } from './types/exec-function';

export class Node {
	private readonly logger: Logger;
	private readonly httpService: HttpService;

	private readonly id: string;
	private task: Task | null;
	private readonly scheduleConfig: ScheduleConfig;

	constructor() {
		this.id = generateShortId();
		this.task = null;
		this.scheduleConfig = {
			timeout: 0.1
		};

		this.logger = new Logger(`${Node.name}_${this.id}`);
		this.httpService = new HttpService();

		this.logger.log('Node initialized');
	}

	async run() {
		await this.healthcheck();
		await this.consume();
	}

	async healthcheck() {
		if (this.task) {
			const updatedTask = await this.httpService.update({
				tid: this.task.tid,
				distributorId: this.task.distributorId,
				nodeId: this.id,
				code: this.task.code,
				result: this.task.result,
				processing: true,
				status: TaskStatus.Processing,
				lastUpdated: new Date()
			});
			if (!updatedTask) {
				this.task = null;
			}
		}

		setTimeout(this.healthcheck.bind(this), 10 * 1000);
	}

	async consume() {
		if (!this.task) {
			this.task = await this.httpService.consume({nodeId: this.id});
			if (this.task) {
				if (this.scheduleConfig.timeout > 0.1) {
					this.logger.log('Connection to adapter establishment');
					this.scheduleConfig.timeout = 0.1;
				}
				await this.execute();
			} else {
				this.scheduleConfig.timeout = this.scheduleConfig.timeout > 5 ? 5 : this.scheduleConfig.timeout * 2;
			}
		}

		setTimeout(this.consume.bind(this), this.scheduleConfig.timeout * 1000);
	}

	async execute() {
		if (!this.task) {
			return;
		}

		const f: ExecFunction = eval(this.task.code);
		const result = f.exec();

		await this.httpService.update({
			tid: this.task.tid,
			distributorId: this.task.distributorId,
			nodeId: this.id,
			status: TaskStatus.Finished,
			processing: false,
			code: this.task.code,
			result: result ? JSON.stringify(result) : null,
			lastUpdated: new Date()
		});

		this.task = null;
	}
}
