import { RhythmType } from '../../lib/common/types';
import { Key, Chord, Time } from '../../lib/core';
import { createMovement, createChordProgression } from '../../lib/composition';
import Random from '../../lib/tools/random';
import '../matchers';

const FOUR_BARS = new Time('4:0:0').ticks;

describe('A Chord Progression test suite', () => {
	it('should generate chords based on a movement timeline - free rhythm', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.Major);

		const movementOptions = {
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, movementOptions);

		const prog = createChordProgression(movement.timeline);

		expect(prog).toLastAround(FOUR_BARS);
		expect(prog).toMatchSnapshot();
	});

	it('should generate chords based on a movement timeline - turn rhythm', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.Major);

		const movementOptions = {
			// timeSignatures: [ [ 4, 4 ] ],
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, movementOptions);

		const prog = createChordProgression(movement.timeline, { rhythmType: RhythmType.Turn, restProb: 0.3 });

		expect(prog).toLastAround(FOUR_BARS);
		expect(prog).toMatchSnapshot();
	});

	it('should generate progression with defined structures', () => {
		// given
		Random.setSeed('test-2');

		const aMaj = new Key('Db', Key.Major);

		const movementOptions = {
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 8, movementOptions);

		const prog = createChordProgression(movement.timeline, {
			structures: [ Chord.Structures.Sixth ],
			inversionProb: 0.5,
			octaves: [ [ 4, 1 ], [ 2, 2 ] ],
			rhythmValues: [ '4nt', '4n' ],
			rhythmDurations: [ '4n' ],
			minChordNotes: 2,
		});

		expect(prog).toLastAround(FOUR_BARS);
		expect(prog).toMatchSnapshot();
	});
});
