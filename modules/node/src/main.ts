import { Node } from './core/node';

const bootstrap = async () => {
	const node = new Node();
	await node.run();
};

bootstrap();
