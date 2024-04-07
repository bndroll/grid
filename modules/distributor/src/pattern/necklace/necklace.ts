import * as fs from 'fs';
import { Distributor } from '../../core/distributor';
import { Config } from '../../common/config/config';
import { Pattern } from '../types/pattern';
import { Logger } from '../../common/logger/logger';
import { generateNecklaceCode } from './necklace-code';

let grid: string[] = [];

export class Necklace implements Pattern {
	private readonly logger = new Logger(Necklace.name);
	private readonly distributor: Distributor;

	constructor(distributor: Distributor) {
		this.distributor = distributor;
	}

	run() {
		try {
			const data = fs.readFileSync(__dirname + '/../../../matrix/grid.json', 'utf8');
			const gridData = JSON.parse(data) as { grid: string[] };
			grid = gridData.grid;
		} catch (err) {
			if (err instanceof Error) {
				this.logger.error('Error while reading file, message:', err.message);
			}
			grid = ['0', '0', '0', '0'];
		}
		Config.GridLength = grid.length;

		this.generateTasks(grid, Config.BatchSize);
	}

	async generateTasks(grid: string[], batchSize: number): Promise<void> {
		const size = grid.length;
		const possibleValues = Array.from({length: 7}, (_, i) => i + 1);
		let batch: number[][] = [];

		const generateNext = async (currentSolution: number[], index: number) => {
			if (index === size) {
				if (batch.length === batchSize) {
					const code = generateNecklaceCode(batch, grid);
					await this.distributor.produce(code);

					batch = [];
				}
				batch.push(currentSolution.slice());
				return;
			}

			for (const value of possibleValues) {
				currentSolution[index] = value;
				await generateNext(currentSolution, index + 1);
			}
		};

		await generateNext(new Array(size).fill(1), 0);
	}

	static printSolutions(solutions: number[][]) {
		const size = Config.GridLength;

		if (size % 2 !== 0) {
			return;
		}

		const delimiter = (new Array(Math.floor(Math.sqrt(size) * 3 + Math.sqrt(size) - 1)).fill('-').join(''));
		for (const solution of solutions) {
			Necklace.printTable(solution, size);
			console.log(delimiter);
		}
	}

	static printTable(solution: number[], size: number) {
		const length = Math.sqrt(size);
		const symbolMap = new Map<number, string>([
			[1, '\u2510'],
			[2, '\u250C'],
			[3, '\u2518'],
			[4, '\u2514'],
			[5, '\u2502'],
			[6, '\u2500'],
			[7, ' ']
		]);

		for (let i = 0; i < length; i++) {
			const row = solution.slice(i * length, (i + 1) * length);
			let rowStr = '';
			for (const cell of row) {
				rowStr += '[' + symbolMap.get(cell) + '] ';
			}
			console.log(rowStr);
		}
	}
}
