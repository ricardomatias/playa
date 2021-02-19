import { Rhythm } from '../../../lib/composition';
import { Random } from '../../../lib/tools';
import '../../matchers';

describe('#concat', () => {
	it('should concat simple', () => {
		// given
		Random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', Rhythm.Presets.Common);
		const splitRhythm = Rhythm.splitAt(rhythm, '1:0:0');

		// when
		const result = Rhythm.concat(...splitRhythm);

		// then
		expect(result).toLastAround(1920 * 2);
		expect(result).toMatchSnapshot();
	});

	it('should concat 2', () => {
		// given
		Random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', [ '1nt', '2nd' ]);
		const splitRhythm = Rhythm.splitAt(rhythm, '1:0:0');

		// when
		const result = Rhythm.concat(splitRhythm[0], splitRhythm[1]);

		// then
		expect(result).toLastAround(1920 * 2);
		expect(result).toMatchSnapshot();
	});

	it('should concat 3', () => {
		// given
		Random.setSeed('test');

		const rhy1 = Rhythm.free('1:0:0', [ '4n', '2n' ]);
		const rhy2 = Rhythm.free('1:0:0', [ '4n', '2n' ]);
		const rhy3 = Rhythm.free('1:0:0', [ '4n', '2n' ]);

		// when
		const result = Rhythm.concat(rhy1, rhy2, rhy3);

		// then
		expect(result).toLastAround(1920 * 3);
		expect(result).toMatchSnapshot();
	});
});
