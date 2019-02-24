import { Key, Chord } from '../../lib/core';
import { createMovement, createChordProgression } from '../../lib/functional';
import { seedRandom } from '../../lib/tools';

const noteType = 'str';

describe('A Chord Progression test suite', () => {
	it('should generate chords based on a movement timeline - free rhythm', () => {
		// given
		seedRandom('test');

		const aMaj = new Key('A', Key.MAJOR, { noteType: 'note' });

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			turns: 6,
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4.0.0', opts);

		const prog = createChordProgression(movement.timeline, { noteType });

		expect(prog).toMatchSnapshot();
	});

	it('should generate chords based on a movement timeline - turn rhythm', () => {
		// given
		seedRandom('test');

		const aMaj = new Key('A', Key.MAJOR, { noteType: 'note' });

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			turns: 6,
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4.0.0', opts);

		const prog = createChordProgression(movement.timeline, { noteType, rhythmType: 'turn' });

		expect(prog).toMatchSnapshot();
	});

	it('should generate progression with defined structures', () => {
		// given
		seedRandom('test-2');

		const aMaj = new Key('Db', Key.MAJOR, { noteType: 'note' });

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			turns: 6,
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '4.0.0', opts);

		const prog = createChordProgression(movement.timeline, {
			structures: [ Chord.SIXTH ],
			inversionProb: 0.5,
			octaves: [ [ 5, 1 ], [ 2, 2 ] ],
			rhythmDistribution: [ '4t', '4n' ],
			minChordNotes: 2,
			noteType,
		});

		expect(prog).toMatchSnapshot();
	});
});
