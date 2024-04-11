import { Logger } from '../common/logger/logger';
import { ConsumeContract } from './contract/consume.contract';
import { FindResultContract, FindResultResponse } from './contract/find-result.contract';
import { UpdateTaskContract } from './contract/update-task.contract';
import { ProduceContract } from './contract/produce.contract';
import { Config } from '../common/config/config';
import { TaskRepository } from './database/repositories/task.repository';
import { Task, TaskModel, TaskStatus } from './database/entities/task.entity';
import mongoose from 'mongoose';

export class Adapter {
	private readonly logger = new Logger(Adapter.name);
	private readonly taskRepository = new TaskRepository();

	constructor() {
		this.logger.log('Adapter initialized');
	}

	async run() {
		await this.scheduleInvalidateStuck();
		await this.scheduleInvalidateFinish();
		await this.scheduleInvalidateOld();
	}

	private async scheduleInvalidateFinish() {
		const allCount = await this.taskRepository.findCount();
		const openCount = await this.taskRepository.findOpenCount();
		const finishedCount = allCount - openCount;
		const invalidatedCount = await this.taskRepository.findInvalidateCount();

		this.logger.debug(` 
----------- Analytics -----------
Current task count: ${allCount}
Current task open count: ${openCount}
Current task finished count: ${finishedCount}
Invalidate count: ${allCount - invalidatedCount}

Current task finished speed: ~ ${finishedCount / 5} RPS
----------------------`);

		await this.taskRepository.deleteInvalidated();

		setTimeout(this.scheduleInvalidateFinish.bind(this), 5 * 1000);
	}

	private async scheduleInvalidateStuck() {
		const tasks = await this.taskRepository.findStuck();

		this.logger.log(`Stuck scheduler, find ${tasks.length} tasks`);
		for (const task of tasks) {
			await this.update({
				tid: task.tid,
				distributorId: task.distributorId,
				nodeId: null,
				status: TaskStatus.Open,
				processing: false,
				code: task.code,
				result: task.result,
				lastUpdated: new Date()
			});
		}

		setTimeout(this.scheduleInvalidateStuck.bind(this), Config.TaskExpireValidateTime);
	}

	private async scheduleInvalidateOld() {
		const oldCount = await this.taskRepository.deleteOld();
		this.logger.log(`Old scheduler, find ${oldCount} tasks`);
		setTimeout(this.scheduleInvalidateOld.bind(this), Config.TaskExpireTime);
	}

	async produce(dto: ProduceContract) {
		await this.taskRepository.create(dto);
	}

	async update(dto: UpdateTaskContract) {
		const task = await this.taskRepository.findByTid(dto.tid);
		if (!task) {
			return null;
		}
		if (dto.nodeId && task.nodeId !== dto.nodeId) {
			return null;
		}

		const updatedTask = await this.taskRepository.updateByTid(dto.tid, dto);

		return Object.assign({}, updatedTask);
	}

	async consume(dto: ConsumeContract) {
		let tSession: mongoose.ClientSession;
		let tT: Task | null = null;
		await TaskModel.createCollection()
			.then(() => mongoose.startSession())
			.then(session => {
				tSession = session;
				tSession.startTransaction();
				return this.taskRepository.findOpen();
			})
			.then(async (task) => {
				if (task) {
					tT = await this.taskRepository.updateByTid(task.tid, {
						tid: task.tid,
						distributorId: task.distributorId,
						nodeId: dto.nodeId,
						status: TaskStatus.Processing,
						processing: true,
						code: task.code,
						result: task.result,
						lastUpdated: new Date()
					});
				} else {
					tT = null;
				}
			})
			.then(() => tSession.commitTransaction())
			.then(() => tSession.endSession());

		return tT;
	}

	async findResult(dto: FindResultContract): Promise<FindResultResponse> {
		const resultTasks = await this.taskRepository.findResult({distributorId: dto.distributorId});
		if (resultTasks.length === 0) {
			const distributorTasks = await this.taskRepository.findByDistributorId({distributorId: dto.distributorId});
			if (distributorTasks === 0) {
				return {tasks: resultTasks, message: 'stop'};
			}
			return {tasks: null, message: 'next'};
		}

		return {tasks: resultTasks, message: 'next'};
	}
}
