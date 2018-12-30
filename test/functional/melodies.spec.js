import fs from 'fs';
import path from 'path';
import { Key } from '../../lib/core';
import { RHYTHMS_DISTRIBUTIONS } from '../../lib/constants';
import { createMovement, createMelodies } from '../../lib/functional';
import { seedRandom, distribute } from '../../lib/tools';

const noteOpts = { noteType: 'note' };

let fixtures;

const fixturePath = path.join(__dirname, 'fixtures', 'melodies.json');

describe('A Melodies test suite', () => {
	before(() => {
		fixtures = JSON.parse(fs.readFileSync(fixturePath, { encoding: 'utf8' }));
	});

	it('should generate melodies based on a movement timeline', () => {
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

		const melodies = createMelodies(movement.timeline);

		expect(melodies).to.eql(fixtures.basic);
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
		const movement = createMovement(aMaj, '3.1.0', opts);

		const melodies = createMelodies(movement.timeline, {
			rhythms: Object.values(RHYTHMS_DISTRIBUTIONS),
			distributions: Object.values(distribute),
			restProb: 0.3,
			octaves: [ 3, 2 ],
		});

		expect(melodies).to.eql(fixtures.options);
	});
});
