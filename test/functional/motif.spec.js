import Scale from '../../lib/core/Scale';
import Chord from '../../lib/core/Chord';
import createMotif, { generateRhythm, calcDuration } from '../../lib/functional/motif';
import { motifs, seedRandom } from '../../lib/tools';
import { TICKS } from '../../lib/constants';

const { descending } = motifs;

const noteOpts = { octaves: [ 4, 1 ], noteType: 'note' };
const ONE_BAR = TICKS.get('1n');


describe('A Motif test suite', () => {
	it('should generate rhythm', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateRhythm(ONE_BAR, descending);

		// then
		expect(rhythm).to.eql([ '4t', '4t', '8n', '8t', '4nd', '8t' ]);

		// given
		seedRandom('test2');

		// when
		rhythm = generateRhythm(ONE_BAR, descending);

		// then
		expect(rhythm).to.eql([ '8n', '8n', '4nd', '4n', '8n' ]);

		// given
		seedRandom('test3');

		// when
		rhythm = generateRhythm(ONE_BAR, descending);

		// then
		expect(rhythm).to.eql([ '8n', '4t', '8n', '4t', '8n', '4t', '8n' ]);
	});

	it('should generate motif based on scale', () => {
		// given
		seedRandom('test');

		const scale = new Scale('A', Scale.MAJOR, noteOpts);

		// when
		let motif = createMotif(scale.notes, '2.1.0', descending);

		// then
		expect(motif).to.eql([
			{ time: 0, note: 'E5', midi: 76, dur: '4t' },
			{ time: 320, note: 'F#5', midi: 78, dur: '4t' },
			{ time: 640, note: 'G#5', midi: 80, dur: '8n' },
			{ time: 880, note: 'D5', midi: 74, dur: '8t' },
			{ time: 1040, note: 'F#5', midi: 78, dur: '4nd' },
			{ time: 1760, note: 'A5', midi: 81, dur: '8t' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR);

		// when
		seedRandom('test2');

		motif = createMotif(scale.notes, '3.1.0', descending);

		// then
		expect(motif).to.eql([
			{ time: 0, note: 'E5', midi: 76, dur: '4nd' },
			{ time: 720, note: 'E5', midi: 76, dur: '4t' },
			{ time: 1040, note: 'C#5', midi: 73, dur: '4t' },
			{ time: 1360, note: 'C#5', midi: 73, dur: '8n' },
			{ time: 1600, note: 'D5', midi: 74, dur: '4nd' },
			{ time: 2320, note: 'F#5', midi: 78, dur: '8n' },
			{ time: 2560, note: 'E5', midi: 76, dur: '4nd' },
			{ time: 3280, note: 'A4', midi: 69, dur: '4t' },
			{ time: 3600, note: 'A5', midi: 81, dur: '8n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR * 2);
	});


	it('should generate createMotif based on chord', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);

		// when
		let motif = createMotif(chord.notes, '2.1.0', descending);

		expect(motif).to.eql([
			{ time: 0, note: 'Ab4', midi: 68, dur: '4t' },
			{ time: 320, note: 'Ab4', midi: 68, dur: '4t' },
			{ time: 640, note: 'Bb4', midi: 70, dur: '8n' },
			{ time: 880, note: 'E4', midi: 63, dur: '8t' },
			{ time: 1040, note: 'Ab4', midi: 68, dur: '4nd' },
			{ time: 1760, note: 'Bb4', midi: 70, dur: '8t' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR);

		// when
		seedRandom('test2');

		motif = createMotif(chord.notes, '3.1.0', descending);

		expect(motif).to.eql([
			{ time: 0, note: 'Ab4', midi: 68, dur: '4nd' },
			{ time: 720, note: 'Ab4', midi: 68, dur: '4t' },
			{ time: 1040, note: 'E4', midi: 63, dur: '4t' },
			{ time: 1360, note: 'E4', midi: 63, dur: '8n' },
			{ time: 1600, note: 'E4', midi: 63, dur: '4nd' },
			{ time: 2320, note: 'Ab4', midi: 68, dur: '8n' },
			{ time: 2560, note: 'Ab4', midi: 68, dur: '4nd' },
			{ time: 3280, note: 'Db4', midi: 61, dur: '4t' },
			{ time: 3600, note: 'Bb4', midi: 70, dur: '8n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR * 2);
	});


	it('should return pattern with time = start time', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);

		// when
		let motif = createMotif(chord.notes, '1.2.0', descending, 0);

		expect(motif).to.eql([
			{ time: 0, note: 'E4', midi: 63, dur: '4t' },
			{ time: 320, note: 'Ab4', midi: 68, dur: '8t' },
		]);


		motif = createMotif(chord.notes, '1.4.0', descending, 480);

		expect(motif).to.eql([
			{ time: 480, note: 'Ab4', midi: 68, dur: '4t' },
			{ time: 800, note: 'Ab4', midi: 68, dur: '4t' },
			{ time: 1120, note: 'Ab4', midi: 68, dur: '8n' },
			{ time: 1360, note: 'Bb4', midi: 70, dur: '8t' },
			{ time: 1520, note: 'Ab4', midi: 68, dur: '8nd' },
		]);
	});
});
