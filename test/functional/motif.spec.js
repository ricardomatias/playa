import * as R from 'ramda';
import Scale from '../../lib/core/Scale';
import Chord from '../../lib/core/Chord';
import createMotif from '../../lib/functional/motif';
import { distribute } from '@ricardomatias/roll';
import { calcDuration } from '../../lib/utils';
import { Rhythm, choose } from '../../lib/tools';
import Random from '../../lib/tools/random';
import { TICKS } from '../../lib/constants';

const { mixed } = Rhythm.presets;

const ONE_BAR = TICKS.get('1n');


describe('A Motif test suite', () => {
	it('should generate motif based on scale', () => {
		// given
		Random.setSeed('test');

		const scale = new Scale('A', Scale.MAJOR);

		let rhythm = Rhythm.free('1:0:0', mixed, [], distribute.decreasing);

		// when
		let motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR);

		// when
		Random.setSeed('test2');

		rhythm = Rhythm.free('2:0:0', mixed, [], distribute.decreasing);

		motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR * 2);
	});


	it('should generate createMotif based on chord', () => {
		// given
		Random.setSeed('test');

		const chord = new Chord('Dbm6');
		let rhythm = Rhythm.free('1:0:0', mixed, [], distribute.decreasing);

		// when
		let motif = createMotif(chord.notes, rhythm);

		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR);

		// when
		Random.setSeed('test2');

		rhythm = Rhythm.free('2:0:0', mixed, [], distribute.decreasing);

		motif = createMotif(chord.notes, rhythm);

		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR * 2);
	});


	it('should return pattern with time = start time', () => {
		// given
		Random.setSeed('test');

		const chord = new Chord('Dbm6');
		let rhythm = Rhythm.free('0:1:0', mixed);

		// when
		let motif = createMotif(chord.notes, rhythm, 0);

		expect(motif).toMatchSnapshot();

		rhythm = Rhythm.free('0:3:0', mixed);

		motif = createMotif(chord.notes, rhythm, 480);

		expect(motif).toMatchSnapshot();
	});

	it('should generate motif with rests', () => {
		// given
		Random.setSeed('test');

		const scale = new Scale('A', Scale.MAJOR);
		const durations = choose(mixed, Random.int(R.length(mixed)));

		const rhythm = Rhythm.free('1:0:0', mixed, durations, distribute.decreasing);

		// when
		const motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR);
	});
});
