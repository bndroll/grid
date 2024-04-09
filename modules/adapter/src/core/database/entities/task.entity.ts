import { Document, model, Schema, Model } from 'mongoose';

export enum TaskStatus {
	Open = 'Open',
	Processing = 'Processing',
	Finished = 'Finished'
}

export interface Task extends Document {
	tid: string;
	distributorId: string;
	nodeId: string | null;
	status: TaskStatus;
	processing: boolean;
	code: string;
	result: string | null;
	lastUpdated: Date;
}

interface ITaskModel extends Model<Task> {}

export const TaskSchema = new Schema({
	tid: {type: String, required: true, index: true},
	distributorId: {type: String, required: true, index: true},
	nodeId: {type: String, required: false, index: true},
	status: {type: String, enum: Object.values(TaskStatus), required: true, TaskStatus, index: true},
	processing: {type: Boolean, required: true},
	code: {type: String, required: true},
	result: {type: String, required: false},
	lastUpdated: {type: Date, required: true, index: true}
});

export const TaskModel = model<Task, ITaskModel>('Task', TaskSchema);
