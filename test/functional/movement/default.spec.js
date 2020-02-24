import { Key } from '../../../lib/core';
import { createMovement } from '../../../lib/functional';
import Random from '../../../lib/tools/random';


describe('A Movement test suite', () => {
	it('should generate a basic movement', () => {
		// given
		Random.setSeed('test');

		const dMin = new Key('D', Key.MINOR);
		// when
		const movement = createMovement(dMin, '4:0:0', 4);

		expect(movement).toMatchSnapshot();
	});

	it('should generate a simple movement - euclidean', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.MAJOR);

		const opts = {
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, opts);

		expect(movement).toMatchSnapshot();
	});

	it('should generate a simple movement - turn rhythm', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.MAJOR);

		const opts = {
			modProb: 0.40,
			rhythm: 'turn',
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, opts);

		expect(movement).toMatchSnapshot();
	});

	it('should generate a long movement - turn rhythm', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.MAJOR);

		const opts = {
			modProb: 0.40,
			rhythm: 'turn',
		};

		// when
		const movement = createMovement(aMaj, '8:0:0', 4, opts);

		expect(movement).toMatchSnapshot();
	});

	it.skip('should generate a movement that repeats', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.MAJOR);

		const opts = {
			modProb: 0.40,
			repeats: 2,
		};

		// when
		const movement = createMovement(aMaj, '8:0:0', 6, opts);

		expect(movement).toMatchSnapshot();
	});
});
