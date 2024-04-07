import { Node } from './core/node';

const bootstrap = async () => {
	const node = new Node();
	node.run();
};

bootstrap();
