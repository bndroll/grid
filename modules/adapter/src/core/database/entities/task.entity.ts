import { Document, model, Schema } from 'mongoose';

export enum TaskStatus {
	Open = 'Open',
	Processing = 'Processing',
	Finished = 'Finished'
}

export interface Task extends Document {
	distributorId: string;
	nodeId: string | null;
	status: TaskStatus;
	processing: boolean;
	code: string;
	result: string | null;
	lastUpdated: Date;
}

const TaskSchema = new Schema({
	distributorId: {type: String, required: true, index: true},
	nodeId: {type: String, required: false, index: true},
	status: {type: String, enum: Object.values(TaskStatus), required: true, TaskStatus, index: true},
	processing: {type: Boolean, required: true},
	code: {type: String, required: true},
	result: {type: String, required: false},
	lastUpdated: {type: Date, required: false, index: true}
});

export const TaskModel = model<typeof TaskSchema>('Task', TaskSchema);
