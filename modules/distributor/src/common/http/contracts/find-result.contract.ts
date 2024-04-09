import { Task } from '../../../core/models/task.model';

export interface FindResultContract {
	distributorId: string;
}

export interface FindResultResponse {
	tasks: Task[] | null;
	message: 'next' | 'stop';
}
