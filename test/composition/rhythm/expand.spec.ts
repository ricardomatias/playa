import { Rhythm } from '../../../lib/composition';
import { T4 } from '../../../lib/core';
import { Random } from '../../../lib/tools';
import '../../matchers';

describe('#expand', () => {
	it('should expand simple', () => {
		// given
		Random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', Rhythm.Presets.Slow);

		// when
		const result = Rhythm.expand(rhythm, T4);

		// then
		expect(result).toLastAround(1920 * 4);
		expect(result).toMatchSnapshot();
	});

	it('should expand irregular rhythm', () => {
		// given
		Random.setSeed('test');

		const rhythm = Rhythm.free('1:2:0', Rhythm.Presets.Slow);

		// when
		const result = Rhythm.expand(rhythm, T4);

		// then
		expect(result).toLastAround(1920 * 4);
		// expect(result).toMatchSnapshot();
	});
});
