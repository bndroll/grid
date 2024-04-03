import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from '../config/config';
import { Task } from '../../core/models/task.model';
import { Logger } from '../logger/logger';
import { ProduceContract } from './contracts/produce.contract';
import { FindResultContract, FindResultResponse } from './contracts/find-result.contract';

export class HttpService {
	private readonly logger = new Logger(HttpService.name);
	private readonly httpInstance: AxiosInstance;

	constructor() {
		this.httpInstance = axios.create({
			baseURL: Config.AdapterUrl
		});
	}

	async produce(dto: ProduceContract): Promise<Task | null> {
		try {
			const {data} = await this.httpInstance.post<Task,
				AxiosResponse<Task>>('/produce', {
				distributorId: dto.distributorId,
				code: dto.code
			});
			return data;
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn('Error while requesting adapter, message =', err.message);
			}
			return null;
		}
	}

	async findResult(dto: FindResultContract) {
		try {
			const {data} = await this.httpInstance.post<FindResultResponse,
				AxiosResponse<FindResultResponse>>('/find-result', {
				distributorId: dto.distributorId
			});
			return data ? data : null;
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn('Error while requesting adapter, message =', err.message);
			}
			return null;
		}
	}
}
