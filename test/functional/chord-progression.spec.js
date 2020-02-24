import { Key, Chord } from '../../lib/core';
import { createMovement, createChordProgression } from '../../lib/functional';
import Random from '../../lib/tools/random';

describe('A Chord Progression test suite', () => {
	it('should generate chords based on a movement timeline - free rhythm', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.MAJOR);

		const opts = {
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, opts);

		const prog = createChordProgression(movement.timeline);

		expect(prog).toMatchSnapshot();
	});

	it('should generate chords based on a movement timeline - turn rhythm', () => {
		// given
		Random.setSeed('test');

		const aMaj = new Key('A', Key.MAJOR);

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 6, opts);

		const prog = createChordProgression(movement.timeline, { rhythmType: 'turn', restProb: 0.3 });

		expect(prog).toMatchSnapshot();
	});

	it('should generate progression with defined structures', () => {
		// given
		Random.setSeed('test-2');

		const aMaj = new Key('Db', Key.MAJOR);

		const opts = {
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4:0:0', 8, opts);

		const prog = createChordProgression(movement.timeline, {
			structures: [ Chord.SIXTH ],
			inversionProb: 0.5,
			octaves: [ [ 4, 1 ], [ 2, 2 ] ],
			rhythms: [ '4nt', '4n' ],
			minChordNotes: 2,
		});

		expect(prog).toMatchSnapshot();
	});
});
