import { Rhythm } from '../../../lib/composition';
import { Time } from '../../../lib/core';
import { random } from '../../../lib/tools';
import '../../matchers';

describe('#expand', () => {
	it('should expand simple', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', Rhythm.Presets.Slow);

		// when
		const result = Rhythm.expand(rhythm, Time.T('4m'));

		// then
		expect(result).toLastAround(1920 * 4);
		expect(result).toMatchSnapshot();
	});

	it('should expand irregular rhythm', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:2:0', Rhythm.Presets.Slow);

		// when
		const result = Rhythm.expand(rhythm, Time.T('4m'));

		// then
		expect(result).toLastAround(1920 * 4);
		// expect(result).toMatchSnapshot();
	});
});
