import { ServerApplication } from './server/server';

const bootstrap = async () => {
	const app = new ServerApplication();
	app.run();
};

bootstrap();
