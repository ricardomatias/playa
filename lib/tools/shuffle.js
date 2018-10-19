import { random } from './random';

const shuffle = (list) => {
	for (let index = 0; index < 10; index++) {
		list.sort(() => Math.floor(random() * 3 - 1));
	}
};

export default shuffle;
