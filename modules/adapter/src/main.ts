import { ServerApplication } from './server/server';
import { Adapter } from './core/adapter';
import { Database } from './core/database/database';

const bootstrap = async () => {
	const database = Database.create();
	await database.connect();

	const adapter = new Adapter();
	await adapter.run();

	const app = new ServerApplication(adapter);
	await app.run();
};

bootstrap();
