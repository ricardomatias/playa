import { TICKS } from '../../../lib/constants';
import {
	seedRandom,
	generateTurnRhythm,
	calcDuration,
} from '../../../lib/tools';

const ONE_BAR = TICKS.get('1n');


describe('#generateTurnRhythm', () => {
	it('should generate turn rhythm', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateTurnRhythm(ONE_BAR * 2, 7, {
			combSorting: { diverseFirst: true },
		});

		// then
		expect(calcDuration(rhythm)).to.eql(ONE_BAR * 2);
		expect(rhythm).to.eql([
			{ time: 0, dur: '8n' },
			{ time: 240, dur: '8n' },
			{ time: 480, dur: '8n' },
			{ time: 720, dur: '8n' },
			{ time: 960, dur: '2n' },
			{ time: 1920, dur: '2n' },
			{ time: 2880, dur: '2n' },
		]);
	});

	it('should generate interesting turn rhythm', () => {
		// given
		seedRandom('foobar');

		// when
		let rhythm = generateTurnRhythm(ONE_BAR * 2, 7, {
			combSorting: { diverseFirst: true },
		});

		// then
		expect(calcDuration(rhythm)).to.eql(ONE_BAR * 2 - TICKS.get('8t'));
		expect(rhythm).to.eql([
			{ time: 0, dur: '4n' },
			{ time: 480, dur: '4n' },
			{ time: 960, dur: '4n' },
			{ time: 1440, dur: '2t' },
			{ time: 2080, dur: '2t' },
			{ time: 2720, dur: '4t' },
			{ time: 3040, dur: '2t' },
		]);
	});

	it('should generate turn rhythm - with min note value', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateTurnRhythm(ONE_BAR * 3, 8, {
			minNoteValue: 4,
		});

		// then
		expect(calcDuration(rhythm)).to.eql(ONE_BAR * 3);
		expect(rhythm).to.eql([
			{ time: 0, dur: '4n' },
			{ time: 480, dur: '4n' },
			{ time: 960, dur: '4n' },
			{ time: 1440, dur: '4n' },
			{ time: 1920, dur: '2n' },
			{ time: 2880, dur: '2n' },
			{ time: 3840, dur: '2n' },
			{ time: 4800, dur: '2n' },
		]);
	});

	it('should generate turn rhythm - with sorting similar first', () => {
		// given
		seedRandom('foo-bar');

		// when
		let rhythm = generateTurnRhythm(ONE_BAR * 3, 5, {
			combSorting: { similarFirst: true },
			minNoteValue: 2,
		});

		// then
		expect(calcDuration(rhythm)).to.eql(ONE_BAR * 3);
		expect(rhythm).to.eql([
			{ time: 0, dur: '2n' },
			{ time: 960, dur: '2n' },
			{ time: 1920, dur: '2n' },
			{ time: 2880, dur: '2n' },
			{ time: 3840, dur: '1n' },
		]);
	});
});
