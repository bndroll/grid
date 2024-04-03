import { Distributor } from './core/distributor';

const bootstrap = async () => {
	const distributor = new Distributor();
	distributor.run();
};

bootstrap();
