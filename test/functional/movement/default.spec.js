import { Key } from '../../../lib/core';
import { createMovement } from '../../../lib/functional';
import { seedRandom } from '../../../lib/tools/random';

const noteOpts = { noteType: 'note' };


describe('A Movement test suite', () => {
	it('should generate a simple movement - euclidean', () => {
		// given
		seedRandom('test');

		const aMaj = new Key('A', Key.MAJOR, noteOpts);

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			turns: 6,
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4.0.0', opts);

		expect(movement).toMatchSnapshot();
	});

	it('should generate a simple movement - turn rhythm', () => {
		// given
		seedRandom('test');

		const aMaj = new Key('A', Key.MAJOR, noteOpts);

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			turns: 6,
			modProb: 0.40,
			rhythm: 'turn',
		};

		// when
		const movement = createMovement(aMaj, '4.0.0', opts);

		expect(movement).toMatchSnapshot();
	});

	it.skip('should generate a movement that repeats', () => {
		// given
		seedRandom('test');

		const aMaj = new Key('A', Key.MAJOR, noteOpts);

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			turns: 6,
			modProb: 0.40,
			repeats: 2,
		};

		// when
		const movement = createMovement(aMaj, '8.0.0', opts);

		expect(movement).toMatchSnapshot();
	});
});
