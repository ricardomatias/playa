import fs from 'fs';
import path from 'path';
import { Key, Chord } from '../../lib/core';
import { createMovement, createChordProgression } from '../../lib/functional';
import { seedRandom } from '../../lib/tools';

const noteOpts = { noteType: 'note' };

let fixtures;

const fixturePath = path.join(__dirname, 'fixtures', 'chord-progression.json');

describe('A Chord Progression test suite', () => {
	before(() => {
		fixtures = JSON.parse(fs.readFileSync(fixturePath, { encoding: 'utf8' }));
	});

	it('should generate chords based on a movement timeline', () => {
		// given
		seedRandom('test');

		const aMaj = new Key('A', Key.MAJOR, noteOpts);

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			turns: 6,
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '5.1.0', opts);

		const prog = createChordProgression(movement.timeline);

		expect(prog).to.eql(fixtures.basic);
	});

	it('should generate progression with defined structures', () => {
		// given
		seedRandom('test-2');

		const aMaj = new Key('Db', Key.MAJOR, noteOpts);

		const opts = {
			timeSignatures: [ [ 4, 4 ] ],
			turns: 6,
			modProb: 0.40,
		};

		// when
		const movement = createMovement(aMaj, '3.1.0', opts);

		const prog = createChordProgression(movement.timeline, { structures: [ Chord.SIXTH ] });

		expect(prog).to.eql(fixtures.structure);
	});
});
