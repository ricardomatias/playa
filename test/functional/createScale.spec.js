import { Scale } from '../../lib/core';
import createScale from '../../lib/functional/scale';

describe('A createScale test suite', () => {
	it('should create F major', () => {
		const fm = createScale('F', Scale.MAJOR);

		expect(fm.str).to.eql([ 'F', 'G', 'A', 'Bb', 'C', 'D', 'E' ]);
		expect(fm.midi).to.eql([ 65, 66, 68, 70, 72, 73, 75, 77, 78, 80, 82, 84, 85, 87, 89 ]);
		expect(fm.freq).to.eql([
			349.2282314330039,
			369.9944227116344,
			415.3046975799451,
			466.1637615180899,
			523.2511306011972,
			554.3652619537442,
			622.2539674441618,
			698.4564628660078,
			739.9888454232688,
			830.6093951598903,
			932.3275230361799,
			1046.5022612023945,
			1108.7305239074883,
			1244.5079348883237,
			1396.9129257320155,
		]);
	});
});
