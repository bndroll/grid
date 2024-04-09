import { Task } from '../database/entities/task.entity';

export interface FindResultContract {
	distributorId: string;
}

export interface FindResultResponse {
	tasks: Task[] | null;
	message: 'next' | 'stop';
}
