import { Distributor } from './core/distributor';
import { Necklace } from './pattern/necklace/necklace';

const bootstrap = async () => {
	const distributor = new Distributor();
	const necklace = new Necklace(distributor);

	distributor.run();
	necklace.run();
};

bootstrap();
