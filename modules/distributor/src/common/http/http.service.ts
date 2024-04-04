import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Config } from '../config/config';
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

	async produce(dto: ProduceContract): Promise<boolean> {
		try {
			await this.httpInstance.post<void,
				AxiosResponse<void>>('/produce', {
				distributorId: dto.distributorId,
				code: dto.code
			});
			return true;
		} catch (err) {
			if (err instanceof Error) {
				this.logger.warn('Error while requesting adapter, message =', err.message);
			}
			return false;
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
