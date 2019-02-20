import Scale from '../../lib/core/Scale';
import Chord from '../../lib/core/Chord';
import createMotif from '../../lib/functional/motif';
import { seedRandom, generateFreeRhythm, distribute, calcDuration } from '../../lib/tools';
import { TICKS, RHYTHMS_DISTRIBUTIONS } from '../../lib/constants';

const { mixed } = RHYTHMS_DISTRIBUTIONS;

const noteOpts = { octaves: [ 4, 1 ], noteType: 'note' };
const ONE_BAR = TICKS.get('1n');


describe('A Motif test suite', () => {
	it('should generate motif based on scale', () => {
		// given
		seedRandom('test');

		const scale = new Scale('A', Scale.MAJOR, noteOpts);

		let rhythm = generateFreeRhythm('2.1.0', mixed, distribute.descending);

		// when
		let motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).to.eql([
			{ time: 0, note: 'D5', midi: 74, dur: '8n' },
			{ time: 240, note: 'C#5', midi: 73, dur: '4n' },
			{ time: 720, note: 'A4', midi: 69, dur: '8t' },
			{ time: 880, note: 'C#5', midi: 73, dur: '8n' },
			{ time: 1120, note: 'E5', midi: 76, dur: '16n' },
			{ time: 1240, note: 'D5', midi: 74, dur: '4t' },
			{ time: 1560, note: 'E5', midi: 76, dur: '8n' },
			{ time: 1800, note: 'C#5', midi: 73, dur: '16n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR);

		// when
		seedRandom('test2');

		rhythm = generateFreeRhythm('3.1.0', mixed, distribute.descending);

		motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).to.eql([
			{ time: 0, note: 'C#5', midi: 73, dur: '8n' },
			{ time: 240, note: 'E5', midi: 76, dur: '4nd' },
			{ time: 960, note: 'D5', midi: 74, dur: '4n' },
			{ time: 1440, note: 'D5', midi: 74, dur: '4t' },
			{ time: 1760, note: 'C#5', midi: 73, dur: '4nd' },
			{ time: 2480, note: 'C#5', midi: 73, dur: '8n' },
			{ time: 2720, note: 'E5', midi: 76, dur: '4t' },
			{ time: 3040, note: 'C#5', midi: 73, dur: '4n' },
			{ time: 3520, note: 'C#5', midi: 73, dur: '8t' },
			{ time: 3680, note: 'E5', midi: 76, dur: '8t' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR * 2);
	});


	it('should generate createMotif based on chord', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);
		let rhythm = generateFreeRhythm('2.1.0', mixed, distribute.descending);

		// when
		let motif = createMotif(chord.notes, rhythm);

		expect(motif).to.eql([
			{ time: 0, note: 'E4', midi: 64, dur: '8n' },
			{ time: 240, note: 'E4', midi: 64, dur: '4n' },
			{ time: 720, note: 'Db4', midi: 61, dur: '8t' },
			{ time: 880, note: 'E4', midi: 64, dur: '8n' },
			{ time: 1120, note: 'Ab4', midi: 68, dur: '16n' },
			{ time: 1240, note: 'E4', midi: 64, dur: '4t' },
			{ time: 1560, note: 'Ab4', midi: 68, dur: '8n' },
			{ time: 1800, note: 'E4', midi: 64, dur: '16n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR);

		// when
		seedRandom('test2');

		rhythm = generateFreeRhythm('3.1.0', mixed, distribute.descending);

		motif = createMotif(chord.notes, rhythm);

		expect(motif).to.eql([
			{ time: 0, note: 'E4', midi: 64, dur: '8n' },
			{ time: 240, note: 'Ab4', midi: 68, dur: '4nd' },
			{ time: 960, note: 'E4', midi: 64, dur: '4n' },
			{ time: 1440, note: 'E4', midi: 64, dur: '4t' },
			{ time: 1760, note: 'E4', midi: 64, dur: '4nd' },
			{ time: 2480, note: 'E4', midi: 64, dur: '8n' },
			{ time: 2720, note: 'Ab4', midi: 68, dur: '4t' },
			{ time: 3040, note: 'E4', midi: 64, dur: '4n' },
			{ time: 3520, note: 'E4', midi: 64, dur: '8t' },
			{ time: 3680, note: 'Ab4', midi: 68, dur: '8t' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR * 2);
	});


	it('should return pattern with time = start time', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);
		let rhythm = generateFreeRhythm('1.2.0', mixed, distribute.descending);

		// when
		let motif = createMotif(chord.notes, rhythm, 0);

		expect(motif).to.eql([
			{ time: 0, note: 'Bb4', midi: 70, dur: '8n' },
			{ time: 240, note: 'E4', midi: 64, dur: '16n' },
			{ time: 360, note: 'Ab4', midi: 68, dur: '16n' },
		]);

		rhythm = generateFreeRhythm('1.4.0', mixed, distribute.descending);

		motif = createMotif(chord.notes, rhythm, 480);

		expect(motif).to.eql([
			{ time: 480, note: 'E4', midi: 64, dur: '4nd' },
			{ time: 1200, note: 'Ab4', midi: 68, dur: '4t' },
			{ time: 1520, note: 'E4', midi: 64, dur: '8n' },
			{ time: 1760, note: 'E4', midi: 64, dur: '8t' },
		]);
	});
});
