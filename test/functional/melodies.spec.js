import * as R from 'ramda';
import { Key } from '../../lib/core';
import { createMovement, createMelodies } from '../../lib/functional';
import { Rhythm } from '../../lib/tools';
import Random from '../../lib/tools/random';
import { distribute } from '@ricardomatias/roll';


describe('A Melodies test suite', () => {
	it('should generate melodies based on a movement timeline - free rhythm', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.MAJOR);

		const opts = {
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, opts);

		const melodies = createMelodies(movement.timeline);

		expect(melodies).toMatchSnapshot();
	});

	it('should generate melodies based on a movement timeline - turn rhythm', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.MAJOR);

		const opts = {
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 8, opts);

		const melodies = createMelodies(movement.timeline, {
			rhythmType: 'turn',
		});

		expect(melodies).toMatchSnapshot();
	});

	it('should generate progression with defined structures', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('Db', Key.MAJOR);

		const opts = {
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '2:0:0', 10, opts);

		const melodies = createMelodies(movement.timeline, {
			rhythms: R.flatten(Object.values(Rhythm.presets)),
			distribution: distribute.decreasing,
			restProb: 0.3,
			octaves: [ [ 2, 1 ], [ 3, 1 ] ],
		});

		expect(melodies).toMatchSnapshot();
	});
});
