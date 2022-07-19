import { Key, Time } from '../../../lib/core';
import { createMovement } from '../../../lib/composition';
import { MovementRhythm } from '../../../lib/composition/movement/types';
import random from '../../../lib/tools/random';

describe('A Movement test suite', () => {
	it('should generate a basic movement', () => {
		// given
		random.setSeed('test');

		const dMin = new Key('D', Key.Minor);
		// when
		const movement = createMovement(dMin, '4:0:0', 4);

		expect(movement).toMatchSnapshot();
	});

	it('should generate a basic movement in 3/4', () => {
		// given
		random.setSeed('test');

		const dMin = new Key('D', Key.Minor);
		// when
		const movement = createMovement(dMin, new Time('2:0:0', [3, 4]), 6);

		expect(movement).toMatchSnapshot();
	});

	it('should generate a simple movement - euclidean', () => {
		// given
		random.setSeed('test-2');

		const aMaj = new Key('A', Key.Major);

		const opts = {
			modProb: 0.4,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, opts);

		expect(movement).toMatchSnapshot();
	});

	it('should generate a simple movement - turn rhythm', () => {
		// given
		random.setSeed('test');

		const aMaj = new Key('A', Key.Major);

		const opts = {
			modProb: 0.4,
			rhythm: MovementRhythm.Turn,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, opts);

		expect(movement).toMatchSnapshot();
	});

	it('should generate a long movement - turn rhythm', () => {
		// given
		random.setSeed('test');

		const aMaj = new Key('A', Key.Major);

		const opts = {
			modProb: 0.4,
			rhythm: MovementRhythm.Turn,
		};

		// when
		const movement = createMovement(aMaj, '8:0:0', 4, opts);

		expect(movement).toMatchSnapshot();
	});
});
