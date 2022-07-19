import * as R from 'ramda';
import { Key } from '../../lib/core';
import { createMovement, createMelodies } from '../../lib/composition';
import * as Rhythm from '../../lib/composition/rhythm';
import random from '../../lib/tools/random';
import { distribute } from '@ricardomatias/roll';
import { RhythmType } from '../../lib/common/types';
import { valuesToArr } from '../../lib/utils';

describe('A Melodies test suite', () => {
	it('should generate melodies based on a movement timeline - free rhythm', () => {
		// given
		random.setSeed('test');

		const aMaj = new Key('A', Key.Major);

		const opts = {
			modProb: 0.4,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, opts);

		const melodies = createMelodies(movement.timeline);

		expect(melodies).toMatchSnapshot();
	});

	it('should generate melodies based on a movement timeline - turn rhythm', () => {
		// given
		random.setSeed('test');

		const aMaj = new Key('A', Key.Major);

		const opts = {
			modProb: 0.4,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 8, opts);

		const melodies = createMelodies(movement.timeline, {
			rhythmType: RhythmType.Turn,
		});

		expect(melodies).toMatchSnapshot();
	});

	it('should generate progression with defined structures', () => {
		// given
		random.setSeed('test');

		const aMaj = new Key('Db', Key.Major);

		const opts = {
			modProb: 0.4,
		};

		// when
		const movement = createMovement(aMaj, '2:0:0', 10, opts);

		const melodies = createMelodies(movement.timeline, {
			rhythmValues: R.flatten(valuesToArr(Rhythm.Presets)),
			distribution: distribute.decreasing,
			restProb: 0.5,
			octaves: [
				[2, 1],
				[3, 1],
			],
		});

		expect(melodies).toMatchSnapshot();
	});
});
