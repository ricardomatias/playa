import { Rhythm } from '../../../lib/composition';
import { random } from '../../../lib/tools';
import '../../matchers';

describe('#splitAt', () => {
	it('should splitAt simple', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', Rhythm.Presets.Common);

		// when
		const result = Rhythm.splitAt(rhythm, '1:0:0');

		// then
		expect(result[0]).toLastAround(1920);
		expect(result).toMatchSnapshot();
	});

	it('should splitAt complex', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', ['1nt', '2nd']);

		// when
		const result = Rhythm.splitAt(rhythm, '1:0:0');

		// then
		expect(result[0]).toLastAround(1920);
		expect(result).toMatchSnapshot();
	});
});
