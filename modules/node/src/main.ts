import { Node } from './core/node';

const bootstrap = async () => {
	const node = new Node();
	node.run();

	/* TODO
	1. деплой на сервер
	4. привести дистрибьютор к общему виду
	5. интегрировать механизм получения и распределения задач
	6. сделать запрос в гпт на перевод языка на js
	7. добавить volume на adapter data
	 */
};

bootstrap();
