import { Key } from '../../lib/core';
import { RHYTHMS_DISTRIBUTIONS } from '../../lib/constants';
import { createMovement, createMelodies } from '../../lib/functional';
import { seedRandom } from '../../lib/tools';
import { distribute } from '@ricardomatias/roll';

const noteOpts = { noteType: 'note' };


describe('A Melodies test suite', () => {
	it('should generate melodies based on a movement timeline - free rhythm', () => {
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

		const melodies = createMelodies(movement.timeline);

		expect(melodies).toMatchSnapshot();
	});

	it('should generate melodies based on a movement timeline - turn rhythm', () => {
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

		const melodies = createMelodies(movement.timeline, {
			rhythmType: 'turn',
		});

		expect(melodies).toMatchSnapshot();
	});

	it('should generate progression with defined structures', () => {
		// given
		seedRandom('test');

		const aMaj = new Key('Db', Key.MAJOR, noteOpts);

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			turns: 10,
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '2.0.0', opts);

		const melodies = createMelodies(movement.timeline, {
			rhythms: Object.values(RHYTHMS_DISTRIBUTIONS),
			distributions: [ distribute.equal, distribute.decreasing ],
			restProb: 0.3,
			octaves: [ [ 2, 1 ], [ 3, 1 ] ],
		});

		expect(melodies).toMatchSnapshot();
	});
});
