import { Scale } from '../../lib/core';
import createScale from '../../lib/functional/scale';

describe('A createScale test suite', () => {
	it('should create F major', () => {
		const fm = createScale('F', Scale.MAJOR);

		expect(fm.str).toEqual([ 'F', 'G', 'A', 'Bb', 'C', 'D', 'E' ]);
		expect(fm.midi).toEqual([ 65, 67, 69, 70, 72, 74, 76, 77, 79, 81, 82, 84, 86, 88, 89 ]);
		expect(fm.freq).toEqual([
			349.2282314330039,
			391.99543598174927,
			440,
			466.1637615180899,
			523.2511306011972,
			587.3295358348151,
			659.2551138257398,
			698.4564628660078,
			783.9908719634985,
			880,
			932.3275230361799,
			1046.5022612023945,
			1174.6590716696303,
			1318.5102276514797,
			1396.9129257320155,
		]);
	});
});
