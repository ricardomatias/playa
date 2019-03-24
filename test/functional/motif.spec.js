import Scale from '../../lib/core/Scale';
import Chord from '../../lib/core/Chord';
import createMotif from '../../lib/functional/motif';
import { seedRandom, generateFreeRhythm, distribute, calcDuration } from '../../lib/tools';
import { TICKS, RHYTHMS_DISTRIBUTIONS } from '../../lib/constants';

const { mixed } = RHYTHMS_DISTRIBUTIONS;

const noteOpts = { octaves: [ 3, 1 ], noteType: 'note' };
const ONE_BAR = TICKS.get('1n');


describe('A Motif test suite', () => {
	it('should generate motif based on scale', () => {
		// given
		seedRandom('test');

		const scale = new Scale('A', Scale.MAJOR, noteOpts);

		let rhythm = generateFreeRhythm('1.0.0', mixed, distribute.descending);

		// when
		let motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR);

		// when
		seedRandom('test2');

		rhythm = generateFreeRhythm('2.0.0', mixed, distribute.descending);

		motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR * 2);
	});


	it('should generate createMotif based on chord', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);
		let rhythm = generateFreeRhythm('1.0.0', mixed, distribute.descending);

		// when
		let motif = createMotif(chord.notes, rhythm);

		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR);

		// when
		seedRandom('test2');

		rhythm = generateFreeRhythm('2.0.0', mixed, distribute.descending);

		motif = createMotif(chord.notes, rhythm);

		expect(motif).toMatchSnapshot();
		expect(calcDuration(motif)).toEqual(ONE_BAR * 2);
	});


	it('should return pattern with time = start time', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);
		let rhythm = generateFreeRhythm('0.1.0', mixed, distribute.descending);

		// when
		let motif = createMotif(chord.notes, rhythm, 0);

		expect(motif).toMatchSnapshot();

		rhythm = generateFreeRhythm('0.3.0', mixed, distribute.descending);

		motif = createMotif(chord.notes, rhythm, 480);

		expect(motif).toMatchSnapshot();
	});
});
