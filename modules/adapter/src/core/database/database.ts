import mongoose from 'mongoose';
import { Logger } from '../../common/logger/logger';

export class Database {
	private static instance: Database;

	private readonly logger = new Logger(Database.name);

	private constructor() {
		this.logger.log('Database initialized');
	}

	static create() {
		if (!Database.instance) {
			this.instance = new Database();
		}
		return this.instance;
	}

	async connect() {
		await mongoose.connect(this.getConnectionUri())
			.then(() => {
				this.logger.log('Successfully connected to database');
			})
			.catch(err => {
				if (err instanceof Error) {
					this.logger.error('Error while connecting to database; Error:', err.message);
				}
			});

		mongoose.connection.on('disconnected', this.connect.bind(this));
	}

	private getConnectionUri(): string {
		return 'mongodb://' +
			process.env.MONGO_USERNAME +
			':' +
			process.env.MONGO_PASSWORD +
			'@' +
			process.env.MONGO_HOST +
			':' +
			process.env.MONGO_PORT +
			'/' +
			process.env.MONGO_DATABASE +
			'?authSource=admin';
	}
}
