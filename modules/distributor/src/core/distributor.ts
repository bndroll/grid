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
		await this.produce(`Math.random() > 0.9 ? "good_${this.id}" : null`);
		await this.produce(`Math.random() > 0.9 ? "good_${this.id}" : null`);
		await this.produce(`Math.random() > 0.9 ? "good_${this.id}" : null`);
		await this.produce(`Math.random() > 0.9 ? "good_${this.id}" : null`);
	}

	async produce(code: string) {
		const producedTask = {distributorId: this.id, code: code};
		this.logger.log(`Produce task, value =`, producedTask);
		await this.httpService.produce({
			distributorId: this.id,
			code: code
		});
	}

	async findResult() {
		const task = await this.httpService.findResult({distributorId: this.id});
		if (task) {
			this.logger.log('Find correct answer, task id =', task.id, 'task result =', task.result);
			return;
		}

		setTimeout(this.findResult.bind(this), 5 * 1000);
	}
}
