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
		const rhythm = generateTurnRhythm(ONE_BAR * 2, 7, {
			combSorting: { diverseFirst: true },
		});

		// then
		expect(calcDuration(rhythm)).toEqual(ONE_BAR * 2);
		expect(rhythm).toEqual([
			{ time: 0, dur: 240 },
			{ time: 240, dur: 240 },
			{ time: 480, dur: 240 },
			{ time: 720, dur: 240 },
			{ time: 960, dur: 960 },
			{ time: 1920, dur: 960 },
			{ time: 2880, dur: 960 },
		]);
	});

	it('should generate interesting turn rhythm', () => {
		// given
		seedRandom('foobar');

		// when
		const rhythm = generateTurnRhythm(ONE_BAR * 2, 7, {
			combSorting: { diverseFirst: true },
		});

		// then
		expect(calcDuration(rhythm)).toEqual(ONE_BAR * 2);
		expect(rhythm).toEqual([
			{ time: 0, dur: 480 },
			{ time: 480, dur: 480 },
			{ time: 960, dur: 480 },
			{ time: 1440, dur: 640 },
			{ time: 2080, dur: 640 },
			{ time: 2720, dur: 320 },
			{ time: 3040, dur: 800 },
		]);
	});

	it('should generate turn rhythm - with min note value', () => {
		// given
		seedRandom('test');

		// when
		const rhythm = generateTurnRhythm(ONE_BAR * 3, 8, {
			minNoteValue: 4,
		});

		// then
		expect(calcDuration(rhythm)).toEqual(ONE_BAR * 3);
		expect(rhythm).toEqual([
			{ time: 0, dur: 480 },
			{ time: 480, dur: 480 },
			{ time: 960, dur: 480 },
			{ time: 1440, dur: 480 },
			{ time: 1920, dur: 960 },
			{ time: 2880, dur: 960 },
			{ time: 3840, dur: 960 },
			{ time: 4800, dur: 960 },
		]);
	});

	it('should generate turn rhythm - with sorting similar first', () => {
		// given
		seedRandom('foo-bar');

		// when
		const rhythm = generateTurnRhythm(ONE_BAR * 3, 5, {
			combSorting: { similarFirst: true },
			minNoteValue: 2,
		});

		// then
		expect(calcDuration(rhythm)).toEqual(ONE_BAR * 3);
		expect(rhythm).toEqual([
			{ time: 0, dur: 960 },
			{ time: 960, dur: 960 },
			{ time: 1920, dur: 960 },
			{ time: 2880, dur: 960 },
			{ time: 3840, dur: 1920 },
		]);
	});
});
