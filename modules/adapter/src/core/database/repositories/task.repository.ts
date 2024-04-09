import { Task, TaskModel, TaskStatus } from '../entities/task.entity';
import { Logger } from '../../../common/logger/logger';
import { FindResultContract } from '../../contract/find-result.contract';
import { ProduceContract } from '../../contract/produce.contract';
import { Config } from '../../../common/config/config';
import { v4 as uuid } from 'uuid';
import { UpdateTaskContract } from '../../contract/update-task.contract';

export class TaskRepository {
	private readonly logger = new Logger(TaskRepository.name);

	constructor() {
		this.logger.log('TaskRepository initialized');
	}

	async create(dto: ProduceContract) {
		const newTask = new TaskModel({
			tid: uuid(),
			distributorId: dto.distributorId,
			nodeId: null,
			status: TaskStatus.Open,
			processing: false,
			code: dto.code,
			result: null,
			lastUpdated: new Date()
		});

		await newTask.save();
	}

	async findByTid(tid: string) {
		return (await TaskModel.findOne({tid: tid}).exec()) as Task;
	}

	async findCount() {
		return await TaskModel.countDocuments().exec();
	}

	async findOpenCount() {
		return await TaskModel.countDocuments({status: TaskStatus.Open}).exec();
	}

	async findInvalidateCount() {
		return await TaskModel.countDocuments({
			$or: [
				{status: {$ne: TaskStatus.Finished}},
				{$and: [{status: TaskStatus.Finished}, {result: {$exists: true, $ne: null}}]}
			]
		}).exec();
	}

	async findResult(dto: FindResultContract) {
		const resultTasks = (await TaskModel.find({
			distributorId: dto.distributorId,
			status: TaskStatus.Finished,
			processing: false,
			result: {$exists: true, $ne: null}
		}).exec()) as Task[];

		await TaskModel.deleteMany({
			distributorId: dto.distributorId,
			status: TaskStatus.Finished,
			processing: false,
			result: {$exists: true, $ne: null}
		}).exec();

		return resultTasks;
	}

	async findStuck() {
		const expireTime = new Date(new Date().getTime() - Config.TaskExpireTime);

		return (await TaskModel.find({
			processing: true,
			lastUpdated: {$lte: expireTime}
		}).exec()) as Task[];
	}

	async findOpen() {
		return (await TaskModel.findOne({
			nodeId: null,
			status: TaskStatus.Open,
			processing: false
		}).exec()) as Task;
	}

	async findByDistributorId(dto: FindResultContract) {
		return await TaskModel.countDocuments({
			distributorId: dto.distributorId
		}).exec();
	}

	async updateByTid(tid: string, dto: UpdateTaskContract) {
		await TaskModel.updateOne({tid: tid}, {
			nodeId: dto.nodeId,
			status: dto.status,
			processing: dto.processing,
			result: dto.result,
			lastUpdated: dto.lastUpdated
		}).exec();
		return await this.findByTid(tid);
	}

	async deleteOld() {
		const expireTime = new Date(new Date().getTime() - Config.TaskExpireTime * 2);

		return (await TaskModel.deleteMany({
			lastUpdated: {$lte: expireTime},
			result: {$exists: true, $ne: null}
		}).exec()).deletedCount;
	}

	async deleteInvalidated() {
		return await TaskModel.deleteMany({
			status: TaskStatus.Finished,
			result: null
		}).exec();
	}
}
