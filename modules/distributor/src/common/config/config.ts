import { config } from 'dotenv';

config();

export interface ConfigType {
	AdapterUrl: string;
}

export const Config: ConfigType = {
	AdapterUrl: process.env.ADAPTER_URL ?? 'http://0.0.0.0:4321'
};
