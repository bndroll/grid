import { config } from 'dotenv';

config();

export interface ConfigType {
	Port: number;
	Url: string;
	TaskExpireTime: number;
	TaskExpireValidateTime: number;
}

export const Config: ConfigType = {
	Port: parseInt(process.env.PORT ?? '4321'),
	Url: process.env.URL ?? '127.0.0.1',
	TaskExpireTime: parseInt(process.env.TASK_EXPIRE_TIME ?? '60000'),
	TaskExpireValidateTime: parseInt(process.env.TASK_EXPIRE_TIME ?? '60000') / 2
};
