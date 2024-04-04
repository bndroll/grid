import { Task } from '../../../core/models/task.model';

export interface FindResultContract {
	distributorId: string;
}

export type FindResultResponse = Task[] | null;
