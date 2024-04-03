import { Task } from '../../../core/models/task.model';

export interface ConsumeContract {
	nodeId: string;
}

export type ConsumeResponse = Task | null;
