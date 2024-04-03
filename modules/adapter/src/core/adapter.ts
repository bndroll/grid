import { Logger } from '../common/logger/logger';
import { Task, TaskStatus } from './models/task.model';
import { ConsumeContract } from './contract/consume.contract';
import { FindResultContract } from './contract/find-result.contract';
import { UpdateTaskContract } from './contract/update-task.contract';
import { ProduceContract } from './contract/produce.contract';
import { Config } from '../common/config/config';

export class Adapter {
	private static instance: Adapter;

	private readonly logger = new Logger(Adapter.name);

	private readonly data: Task[];
	private mutex: boolean;
	private id: number;

	private constructor() {
		this.data = [];
		this.mutex = false;
		this.id = 0;

		this.logger.log('Initialized');
	}

	static create() {
		if (!this.instance) {
			this.instance = new Adapter();
		}

		return this.instance;
	}

	run() {
		this.scheduleReset();
	}

	private async scheduleReset() {
		const oldTasks = await this.findOldTasks();
		this.logger.log(`Reset scheduler, find ${oldTasks.length} old tasks`);
		for (const oldTask of oldTasks) {
			await this.update({
				id: oldTask.id,
				nodeId: null,
				status: TaskStatus.Open,
				processing: false
			});
		}

		setTimeout(this.scheduleReset.bind(this), Config.TaskExpireValidateTime);
	}

	async produce(dto: ProduceContract): Promise<Task> {
		const id = this.generateId();
		this.data.push({
			id: id,
			distributorId: dto.distributorId,
			nodeId: null,
			status: TaskStatus.Open,
			processing: false,
			code: dto.code,
			result: null,
			lastUpdated: new Date()
		});

		this.logger.log(`Produce from distributor ${dto.distributorId}, task id =`, this.data[id - 1].id);

		return Object.assign({}, this.data[id - 1]);
	}

	async update(dto: UpdateTaskContract) {
		if (dto.nodeId && this.data[dto.id - 1].nodeId !== dto.nodeId) {
			return null;
		}
		const updatedTask: Task = Object.assign(this.data[dto.id - 1], dto);
		this.data[dto.id - 1] = updatedTask;

		return Object.assign({}, updatedTask);
	}

	async consume(dto: ConsumeContract) {
		while (true) {
			if (this.mutex) {
				continue;
			}
			this.mutex = true;

			const task = this.data.find(item =>
				item.nodeId === null &&
				item.status === TaskStatus.Open &&
				!item.processing
			);
			if (!task) {
				this.mutex = false;
				return null;
			}

			const updatedTask: Task = {
				...task,
				nodeId: dto.nodeId,
				status: TaskStatus.Processing,
				processing: true,
				lastUpdated: new Date()
			};
			this.data[task.id - 1] = updatedTask;
			this.logger.log(`Consume from node ${dto.nodeId}, task id = ${updatedTask.id}`);
			this.mutex = false;

			return updatedTask;
		}
	}

	async findResult(dto: FindResultContract) {
		return this.data.find(item =>
			item.distributorId === dto.distributorId &&
			item.status === TaskStatus.Finished &&
			!item.processing &&
			item.result
		);
	}

	private async findOldTasks() {
		const now = new Date();
		return this.data.filter(item =>
			item.processing &&
			now.getTime() - item.lastUpdated.getTime() >= Config.TaskExpireTime
		);
	}

	private generateId(): number {
		this.id++;
		return this.id;
	}
}
