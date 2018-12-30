import Scale from '../../lib/core/Scale';
import Chord from '../../lib/core/Chord';
import createMotif, { calcDuration } from '../../lib/functional/motif';
import { seedRandom, generateRhythm, distribute } from '../../lib/tools';
import { TICKS, RHYTHMS_DISTRIBUTIONS } from '../../lib/constants';

const { mixed } = RHYTHMS_DISTRIBUTIONS;

const noteOpts = { octaves: [ 4, 1 ], noteType: 'note' };
const ONE_BAR = TICKS.get('1n');


describe('A Motif test suite', () => {
	it('should generate motif based on scale', () => {
		// given
		seedRandom('test');

		const scale = new Scale('A', Scale.MAJOR, noteOpts);

		let rhythm = generateRhythm('2.1.0', mixed, distribute.descending);

		// when
		let motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).to.eql([
			{ time: 0, note: 'D5', midi: 74, dur: '4n' },
			{ time: 480, note: 'C#5', midi: 73, dur: '4t' },
			{ time: 800, note: 'E5', midi: 76, dur: '8t' },
			{ time: 960, note: 'F#5', midi: 78, dur: '4nd' },
			{ time: 1680, note: 'F#5', midi: 78, dur: '8n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR);

		// when
		seedRandom('test2');

		rhythm = generateRhythm('3.1.0', mixed, distribute.descending);

		motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).to.eql([
			{ time: 0, note: 'E5', midi: 76, dur: '8n' },
			{ time: 240, note: 'C#5', midi: 73, dur: '4nd' },
			{ time: 960, note: 'F#5', midi: 78, dur: '8n' },
			{ time: 1200, note: 'D5', midi: 74, dur: '4nd' },
			{ time: 1920, note: 'C#5', midi: 73, dur: '8n' },
			{ time: 2160, note: 'D5', midi: 74, dur: '4nd' },
			{ time: 2880, note: 'D5', midi: 74, dur: '4nd' },
			{ time: 3600, note: 'A5', midi: 81, dur: '8n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR * 2);
	});


	it('should generate createMotif based on chord', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);
		let rhythm = generateRhythm('2.1.0', mixed, distribute.descending);

		// when
		let motif = createMotif(chord.notes, rhythm);

		expect(motif).to.eql([
			{ time: 0, note: 'E4', midi: 63, dur: '4n' },
			{ time: 480, note: 'E4', midi: 63, dur: '4t' },
			{ time: 800, note: 'Ab4', midi: 68, dur: '8t' },
			{ time: 960, note: 'Ab4', midi: 68, dur: '4nd' },
			{ time: 1680, note: 'Ab4', midi: 68, dur: '8n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR);

		// when
		seedRandom('test2');

		rhythm = generateRhythm('3.1.0', mixed, distribute.descending);

		motif = createMotif(chord.notes, rhythm);

		expect(motif).to.eql([
			{ time: 0, note: 'Ab4', midi: 68, dur: '8n' },
			{ time: 240, note: 'E4', midi: 63, dur: '4nd' },
			{ time: 960, note: 'Ab4', midi: 68, dur: '8n' },
			{ time: 1200, note: 'E4', midi: 63, dur: '4nd' },
			{ time: 1920, note: 'E4', midi: 63, dur: '8n' },
			{ time: 2160, note: 'E4', midi: 63, dur: '4nd' },
			{ time: 2880, note: 'E4', midi: 63, dur: '4nd' },
			{ time: 3600, note: 'Bb4', midi: 70, dur: '8n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR * 2);
	});


	it('should return pattern with time = start time', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);
		let rhythm = generateRhythm('1.2.0', mixed, distribute.descending);

		// when
		let motif = createMotif(chord.notes, rhythm, 0);

		expect(motif).to.eql([
			{ time: 0, note: 'Ab4', midi: 68, dur: '4t' },
			{ time: 320, note: 'Ab4', midi: 68, dur: '8t' },
		]);

		rhythm = generateRhythm('1.4.0', mixed, distribute.descending);

		motif = createMotif(chord.notes, rhythm, 480);

		expect(motif).to.eql([
			{ time: 480, note: 'E4', midi: 63, dur: '4n' },
			{ time: 960, note: 'Db4', midi: 61, dur: '4n' },
			{ time: 1440, note: 'E4', midi: 63, dur: '4n' },
		]);
	});
});
