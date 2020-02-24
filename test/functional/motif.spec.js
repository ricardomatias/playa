import Scale from '../../lib/core/Scale';
import Chord from '../../lib/core/Chord';
import createMotif from '../../lib/functional/motif';
import { distribute } from '@ricardomatias/roll';
import { calcDuration } from '../../lib/tools/time';
import { Rhythm } from '../../lib/tools';
import { seedRandom } from '../../lib/tools/random';
import { TICKS } from '../../lib/constants';

const { mixed } = Rhythm.presets;

const ONE_BAR = TICKS.get('1n');


describe('A Motif test suite', () => {
	it('should generate motif based on scale', () => {
		// given
		seedRandom('test');

		const scale = new Scale('A', Scale.MAJOR);

		let rhythm = Rhythm.free('1:0:0', mixed, distribute.decreasing);

		// when
		let motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR);

		// when
		seedRandom('test2');

		rhythm = Rhythm.free('2:0:0', mixed, distribute.decreasing);

		motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR * 2);
	});


	it('should generate createMotif based on chord', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6');
		let rhythm = Rhythm.free('1:0:0', mixed, distribute.decreasing);

		// when
		let motif = createMotif(chord.notes, rhythm);

		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR);

		// when
		seedRandom('test2');

		rhythm = Rhythm.free('2:0:0', mixed, distribute.decreasing);

		motif = createMotif(chord.notes, rhythm);

		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR * 2);
	});


	it('should return pattern with time = start time', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6');
		let rhythm = Rhythm.free('0:1:0', mixed, distribute.decreasing);

		// when
		let motif = createMotif(chord.notes, rhythm, 0);

		expect(motif).toMatchSnapshot();

		rhythm = Rhythm.free('0:3:0', mixed, distribute.decreasing);

		motif = createMotif(chord.notes, rhythm, 480);

		expect(motif).toMatchSnapshot();
	});
});
