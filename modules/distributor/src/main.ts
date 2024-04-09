import { Distributor } from './core/distributor';
import { Necklace } from './pattern/necklace/necklace';

const bootstrap = async () => {
	const distributor = new Distributor();
	await distributor.run();

	const necklace = new Necklace(distributor);
	await necklace.run();
};

bootstrap();
