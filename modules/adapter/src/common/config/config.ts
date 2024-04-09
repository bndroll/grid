import { config } from 'dotenv';

config();

export interface ConfigType {
	Port: number;
	Url: string;
	TaskExpireTime: number;
	TaskExpireValidateTime: number;
	MongoHost: string;
	MongoPort: number;
	MongoUsername: string;
	MongoPassword: string;
	MongoDatabase: string;
}

export const Config: ConfigType = {
	Port: parseInt(process.env.APP_PORT ?? '8010'),
	Url: process.env.URL ?? '127.0.0.1',
	TaskExpireTime: parseInt(process.env.TASK_EXPIRE_TIME ?? '60000'),
	TaskExpireValidateTime: parseInt(process.env.TASK_EXPIRE_TIME ?? '60000') / 2,
	MongoHost: process.env.MONGO_HOST ?? '127.0.0.1',
	MongoPort: parseInt(process.env.MONGO_PORT ?? '27017'),
	MongoUsername: process.env.MONGO_USERNAME ?? 'username',
	MongoPassword: process.env.MONGO_PASSWORD ?? 'password',
	MongoDatabase: process.env.MONGO_DATABASE ?? 'database'
};
