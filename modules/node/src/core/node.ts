import { Logger } from '../common/logger/logger';
import { generateShortId } from '../utils/generate-short-id';
import { Task, TaskStatus } from './models/task.model';
import { HttpService } from '../common/http/http.service';

export class Node {
	private readonly logger;
	private readonly httpService: HttpService;

	private readonly id: string;
	private task: Task | null;

	constructor() {
		this.id = generateShortId();
		this.task = null;

		this.logger = new Logger(`${Node.name}_${this.id}`);
		this.httpService = new HttpService();

		this.logger.log('Initialized');
	}

	run() {
		this.healthcheck();
		this.consume();
	}

	async healthcheck() {
		if (this.task) {
			const updatedTask = await this.httpService.update({
				id: this.task.id,
				nodeId: this.id,
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
			await this.execute();
		}

		this.logger.log(`Consume new task, task id = ${this.task ? this.task.id : null}`);

		setTimeout(this.consume.bind(this), 10 * 1000);
	}

	async execute() {
		if (!this.task) {
			return;
		}

		const res = eval(this.task.code);
		const updatedTask = await this.httpService.update({
			id: this.task.id,
			nodeId: this.id,
			status: TaskStatus.Finished,
			processing: false,
			result: res ? res : null
		});

		this.logger.log(`Task finished, task id = ${updatedTask ? updatedTask.id : null}`);

		this.task = null;
	}
}
