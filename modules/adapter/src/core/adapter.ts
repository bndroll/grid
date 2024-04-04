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

	private data: Task[];
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
		this.scheduleAnalytics();
		this.scheduleInvalidate();
	}

	private async scheduleAnalytics() {
		const allCount = this.data.length;
		const openCount = this.data.filter(item => item.status === TaskStatus.Open).length;
		const finishedCount = allCount - openCount;

		this.logger.debug(` 
----------- Analytics -----------
Current task count: ${allCount}
Current task open count: ${openCount}
Current task finished count: ${finishedCount}

Current task finished speed: ~ ${finishedCount / 10} RPS
----------------------`);

		setTimeout(this.scheduleAnalytics.bind(this), 10 * 1000);
	}

	private async scheduleInvalidate() {
		const newData = this.data.filter(item =>
			item.status !== 'Finished' ||
			(item.status === 'Finished' && item.result)
		);
		this.logger.log(`Invalidate ${this.data.length - newData.length}`);
		this.data = newData;

		setTimeout(this.scheduleInvalidate.bind(this), 5 * 1000);
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

	async produce(dto: ProduceContract) {
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
	}

	async update(dto: UpdateTaskContract) {
		const taskArrayId = this.search(dto.id);
		if (dto.nodeId && this.data[taskArrayId].nodeId !== dto.nodeId) {
			return null;
		}
		const updatedTask: Task = Object.assign(this.data[taskArrayId], dto);
		this.data[taskArrayId] = updatedTask;

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
			const taskArrayId = this.search(task.id);

			const updatedTask: Task = {
				...task,
				nodeId: dto.nodeId,
				status: TaskStatus.Processing,
				processing: true,
				lastUpdated: new Date()
			};
			this.data[taskArrayId] = updatedTask;
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

	private search(id: number): number {
		let start = 0;
		let end = this.data.length - 1;

		while (start <= end) {
			let middle = Math.floor((start + end) / 2);

			if (this.data[middle].id === id) {
				return middle;
			} else if (this.data[middle].id < id) {
				start = middle + 1;
			} else {
				end = middle - 1;
			}
		}

		return -1;
	}
}
