import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from '../config/config';
import { Task } from '../../core/models/task.model';
import { Logger } from '../logger/logger';
import { ConsumeContract, ConsumeResponse } from './contracts/consume.contract';
import { UpdateTaskContract } from './contracts/update-task.contract';

export class HttpService {
	private readonly logger = new Logger(HttpService.name);
	private readonly httpInstance: AxiosInstance;

	constructor() {
		this.httpInstance = axios.create({
			baseURL: Config.AdapterUrl
		});
	}

	async consume(dto: ConsumeContract): Promise<Task | null> {
		try {
			const {data} = await this.httpInstance.post<ConsumeResponse,
				AxiosResponse<ConsumeResponse>>('/consume', {
				nodeId: dto.nodeId
			});
			return data ? data : null;
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn('Error while requesting adapter, message =', err.message);
			}
			return null;
		}
	}

	async update(dto: UpdateTaskContract): Promise<Task | null> {
		try {
			const {data} = await this.httpInstance.post<ConsumeResponse,
				AxiosResponse<ConsumeResponse>>('/update', {
				id: dto.id,
				distributorId: dto.distributorId,
				nodeId: dto.nodeId,
				status: dto.status,
				processing: dto.processing,
				code: dto.code,
				result: dto.result,
				lastUpdated: dto.lastUpdated
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
