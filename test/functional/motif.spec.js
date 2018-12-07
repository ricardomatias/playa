import Scale from '../../lib/core/Scale';
import Chord from '../../lib/core/Chord';
import createMotif, { generateRhythm, calcDuration } from '../../lib/functional/motif';
import { motifs, seedRandom } from '../../lib/tools';
import { TICKS } from '../../lib/constants';

const { basic } = motifs;

const noteOpts = { octaves: [ 4, 1 ], noteType: 'note' };
const ONE_BAR = TICKS.get('1m');


describe('A Motif test suite', () => {
	it('should generate rhythm', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateRhythm(ONE_BAR, basic);

		// then
		expect(rhythm).to.eql([ '4n.', '8n', '4n', '4n' ]);

		// given
		seedRandom('test2');

		// when
		rhythm = generateRhythm(ONE_BAR, basic);

		// then
		expect(rhythm).to.eql([ '4n', '4n.', '4n.' ]);

		// given
		seedRandom('test3');

		// when
		rhythm = generateRhythm(ONE_BAR, basic);

		// then
		expect(rhythm).to.eql([ '8n', '4t', '8n', '4t', '8n', '4t', '8n' ]);
	});

	it('should generate motif based on scale', () => {
		// given
		seedRandom('test');

		const scale = new Scale('A', Scale.MAJOR, noteOpts);

		// when
		let motif = createMotif(scale.notes, '1:0:0', basic);

		// then
		expect(motif).to.eql([
			{ time: 0, note: 'D5', midi: 74, dur: '4n.' },
			{ time: '288i', note: 'F#5', midi: 78, dur: '8n' },
			{ time: '384i', note: 'D5', midi: 74, dur: '4n' },
			{ time: '576i', note: 'F#5', midi: 78, dur: '4n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR);

		// when
		seedRandom('test2');

		motif = createMotif(scale.notes, '2:0:0', basic);

		// then
		expect(motif).to.eql([
			{ time: 0, note: 'E5', midi: 76, dur: '4n.' },
			{ time: '288i', note: 'E5', midi: 76, dur: '4t' },
			{ time: '416i', note: 'C#5', midi: 73, dur: '4t' },
			{ time: '544i', note: 'C#5', midi: 73, dur: '8n' },
			{ time: '640i', note: 'D5', midi: 74, dur: '4n.' },
			{ time: '928i', note: 'F#5', midi: 78, dur: '8n' },
			{ time: '1024i', note: 'E5', midi: 76, dur: '4n.' },
			{ time: '1312i', note: 'A4', midi: 69, dur: '4t' },
			{ time: '1440i', note: 'A5', midi: 81, dur: '8n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR * 2);
	});


	it('should generate createMotif based on chord', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);

		// when
		let motif = createMotif(chord.notes, '1:0:0', basic);

		expect(motif).to.eql([
			{ time: 0, note: 'E4', midi: 63, dur: '4n.' },
			{ time: '288i', note: 'Ab4', midi: 68, dur: '8n' },
			{ time: '384i', note: 'E4', midi: 63, dur: '4n' },
			{ time: '576i', note: 'Ab4', midi: 68, dur: '4n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR);

		// when
		seedRandom('test2');

		motif = createMotif(chord.notes, '2:0:0', basic);

		expect(motif).to.eql([
			{ time: 0, note: 'Ab4', midi: 68, dur: '4n.' },
			{ time: '288i', note: 'Ab4', midi: 68, dur: '4t' },
			{ time: '416i', note: 'E4', midi: 63, dur: '4t' },
			{ time: '544i', note: 'E4', midi: 63, dur: '8n' },
			{ time: '640i', note: 'E4', midi: 63, dur: '4n.' },
			{ time: '928i', note: 'Ab4', midi: 68, dur: '8n' },
			{ time: '1024i', note: 'Ab4', midi: 68, dur: '4n.' },
			{ time: '1312i', note: 'Db4', midi: 61, dur: '4t' },
			{ time: '1440i', note: 'Bb4', midi: 70, dur: '8n' },
		]);

		expect(calcDuration(motif)).to.eql(ONE_BAR * 2);
	});


	it('should return pattern with time = start time', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', noteOpts);

		// when
		let motif = createMotif(chord.notes, '0:1:0', basic, 0, true);

		expect(motif).to.eql([
			{ time: 0, note: 'E4', midi: 63, dur: '4t' },
			{ time: 0, note: 'Ab4', midi: 68, dur: '8t' },
		]);


		motif = createMotif(chord.notes, '0:3:0', basic, '768i', true);

		expect(motif).to.eql([
			{ time: '768i', note: 'Ab4', midi: 68, dur: '4t' },
			{ time: '768i', note: 'E4', midi: 63, dur: '8n' },
			{ time: '768i', note: 'Db4', midi: 61, dur: '8t' },
			{ time: '768i', note: 'Ab4', midi: 68, dur: '4n.' },
		]);
	});
});
