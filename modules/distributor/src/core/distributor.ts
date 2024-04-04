import { Logger } from '../common/logger/logger';
import { generateShortId } from '../utils/generate-short-id';
import { HttpService } from '../common/http/http.service';

export class Distributor {
	private readonly logger;
	private readonly httpService: HttpService;

	private readonly id: string;

	constructor() {
		this.id = generateShortId();

		this.logger = new Logger(`${Distributor.name}_${this.id}`);
		this.httpService = new HttpService();

		this.logger.log('Initialized');
	}

	run() {
		this.produceTasks();
		this.findResult();
	}

	async produceTasks() {
		for (let i = 0; i < 2000; i++) {
			await this.produce(`null`);
		}
		await this.produce(`"something"`);
	}

	async produce(code: string) {
		await this.httpService.produce({
			distributorId: this.id,
			code: code
		});
	}

	async findResult() {
		const task = await this.httpService.findResult({distributorId: this.id});
		if (task) {
			this.logger.log('Find correct answer, task id =', task.id, 'task result =', task.result);
			process.exit(0);
		}

		setTimeout(this.findResult.bind(this), 5 * 1000);
	}
}
