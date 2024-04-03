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
	Url: process.env.URL ?? '0.0.0.0',
	TaskExpireTime: parseInt(process.env.TASK_EXPIRE_TIME ?? '60000'),
	TaskExpireValidateTime: parseInt(process.env.TASK_EXPIRE_TIME ?? '60000') / 2
};
