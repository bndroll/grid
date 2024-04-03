export enum TaskStatus {
	Open = 'Open',
	Processing = 'Processing',
	Finished = 'Finished'
}

export interface Task {
	id: number;
	distributorId: string;
	nodeId: string | null;
	status: TaskStatus;
	processing: boolean;
	code: string;
	result: string | null;
	lastUpdated: Date;
}
