import { Logger } from '../common/logger/logger';
import { generateShortId } from '../utils/generate-short-id';
import { HttpService } from '../common/http/http.service';
import { ScheduleConfig } from './types/schedule';
import { Necklace } from '../pattern/necklace/necklace';

export class Distributor {
	private readonly logger;
	private readonly httpService: HttpService;

	private readonly id: string;
	private readonly scheduleConfig: ScheduleConfig;

	constructor() {
		this.id = generateShortId();
		this.scheduleConfig = {
			timeout: 5
		};

		this.logger = new Logger(`${Distributor.name}_${this.id}`);
		this.httpService = new HttpService();

		this.logger.log('Distributor initialized');
	}

	async run() {
	}

	async produce(code: string) {
		await this.httpService.produce({
			distributorId: this.id,
			code: code
		});
	}

	async findResult() {
		const result = await this.httpService.findResult({distributorId: this.id});
		if (result) {
			const resultTasks = result.tasks;
			if (resultTasks && resultTasks.length !== 0) {
				for (const task of resultTasks) {
					// @ts-ignore
					const solution = JSON.parse(task.result!) as number[][]
					this.logger.log('Find solution, task id:', task.tid, 'solution:', solution);
					Necklace.printSolutions(solution);
				}
			}
		}

		setTimeout(this.findResult.bind(this), this.scheduleConfig.timeout * 1000);
	}
}
