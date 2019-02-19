import { Scale } from '../../lib/core';
import { distribute, seedRandom, roll } from '../../lib/tools';

const am = new Scale('A', Scale.MINOR, { noteType: 'str' });

describe('A Roll test suite', () => {
	beforeEach(() => seedRandom('test'));

	it('should roll equally', () => {
		const probabilities = distribute.equal(am.notes.length);

		expect(roll(am.notes, probabilities)).to.eql('D');
		expect(roll(am.notes, probabilities)).to.eql('B');
		expect(roll(am.notes, probabilities)).to.eql('G');
	});

	it('should distribute descending', () => {
		const probabilities = distribute.descending(am.notes.length);

		expect(roll(am.notes, probabilities)).to.eql('B');
		expect(roll(am.notes, probabilities)).to.eql('A');
		expect(roll(am.notes, probabilities)).to.eql('E');
	});
});
