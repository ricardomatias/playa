import fs from 'fs';
import path from 'path';
import { Key } from '../../lib/core';
import { createMovement } from '../../lib/functional';
import { seedRandom } from '../../lib/tools';

const noteOpts = { noteType: 'note' };

let fixtures;

describe('A Movement test suite', () => {
	before(() => {
		fixtures = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'movement.json'), { encoding: 'utf8' }));
	});

	it('should generate a simple movement', () => {
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

		expect(movement).to.be.eql(fixtures.basic);
	});
});
