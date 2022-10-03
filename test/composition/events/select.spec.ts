import { Rhythm, Events } from '../../../lib/composition';
import { random } from '../../../lib/tools';
import '../../matchers';

describe('#select', () => {
	it('should select every 2n before after 4n', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:0:0', ['8n']);

		// when
		const after = Events.select(rhythm).every('2n').after('4n').silence();
		const before = Events.select(rhythm).every('2n').before('4n').silence();

		expect(after).toMatchSnapshot();
		expect(before).toMatchSnapshot();
	});

	it('should select before after 2n', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:0:0', ['8n']);

		// when
		const after = Events.select(rhythm).after('2n').silence();
		const before = Events.select(rhythm).before('2n').silence();

		expect(after).toMatchSnapshot();
		expect(before).toMatchSnapshot();
	});

	it('should select before after 2n', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:0:0', ['8n']);

		// when
		const results = Events.select(rhythm)
			.before('2n')
			.apply((event) => {
				event.isRest = random.boolean();
			});

		expect(results).toMatchSnapshot();
	});
});
