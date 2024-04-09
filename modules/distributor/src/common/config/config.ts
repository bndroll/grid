import { config } from 'dotenv';

config();

export interface ConfigType {
	AdapterUrl: string;
	BatchSize: number;
	GridLength: number;
}

export const Config: ConfigType = {
	AdapterUrl: process.env.ADAPTER_URL ?? 'http://0.0.0.0:4321',
	BatchSize: parseInt(process.env.BATCH_SIZE ?? '500'),
	GridLength: parseInt(process.env.GRID_LENGTH ?? '4'),
};
