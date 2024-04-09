import { TaskStatus } from '../database/entities/task.entity';

export interface UpdateTaskContract {
	tid: string;
	distributorId: string;
	nodeId: string | null;
	status: TaskStatus;
	processing: boolean;
	code: string;
	result: string | null;
	lastUpdated: Date;
}
