import Scale from '../../lib/core/Scale';
import Chord from '../../lib/core/Chord';
import assignOctaves from '../../lib/utils/assignOctaves';
import motif, { generateRhythm } from '../../lib/functional/motif';
import { motifs, seedRandom } from '../../lib/tools';
import { TICKS } from '../../lib/constants';

const { normal } = motifs;

const TYPE = { noteType: 'note' };
const ONE_BAR = TICKS.get('1m');


describe('A Motif test suite', () => {
	it('should generate rhythm', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateRhythm(ONE_BAR, normal);

		// then
		expect(rhythm).to.eql([ '4n.', '8n', '4n', '4n' ]);

		// given
		seedRandom('test2');

		// when
		rhythm = generateRhythm(ONE_BAR, normal);

		// then
		expect(rhythm).to.eql([ '4n', '4n.', '4n.' ]);

		// given
		seedRandom('test3');

		// when
		rhythm = generateRhythm(ONE_BAR, normal);

		// then
		expect(rhythm).to.eql([ '8n', '4t', '8n', '4t', '8n', '4t', '8n' ]);
	});

	it('should generate motif based on scale', () => {
		// given
		seedRandom('test');

		const scale = new Scale('A', Scale.MAJOR, TYPE);
		const Amaj = assignOctaves(scale.notes, [ 4, 1 ]);

		// when
		let m = motif(Amaj, '1:0:0', normal);

		// then
		expect(m).to.eql([
			{ time: 0, note: 'D5', midi: 74, dur: '4n.' },
			{ time: '96i', note: 'F#5', midi: 78, dur: '8n' },
			{ time: '288i', note: 'D5', midi: 74, dur: '4n' },
			{ time: '480i', note: 'F#5', midi: 78, dur: '4n' },
		]);

		// when
		seedRandom('test2');

		m = motif(Amaj, '2:0:0', normal);

		// then
		expect(m).to.eql([
			{ time: 0, note: 'E5', midi: 76, dur: '4n.' },
			{ time: '128i', note: 'E5', midi: 76, dur: '4t' },
			{ time: '256i', note: 'C#5', midi: 73, dur: '4t' },
			{ time: '352i', note: 'C#5', midi: 73, dur: '8n' },
			{ time: '640i', note: 'D5', midi: 74, dur: '4n.' },
			{ time: '736i', note: 'F#5', midi: 78, dur: '8n' },
			{ time: '1024i', note: 'E5', midi: 76, dur: '4n.' },
			{ time: '1152i', note: 'A4', midi: 69, dur: '4t' },
			{ time: '1248i', note: 'A5', midi: 81, dur: '8n' },
		]);
	});

	it('should generate motif based on chord', () => {
		// given
		seedRandom('test');

		const chord = new Chord('Dbm6', TYPE);
		const Dbm6 = assignOctaves(chord.notes, [ 4, 1 ], 'chord');

		// when
		let m = motif(Dbm6, '1:0:0', normal);

		expect(m).to.eql([
			{ time: 0, note: 'E4', midi: 63, dur: '4n.' },
			{ time: '96i', note: 'Ab4', midi: 68, dur: '8n' },
			{ time: '288i', note: 'E4', midi: 63, dur: '4n' },
			{ time: '480i', note: 'Ab4', midi: 68, dur: '4n' },
		]);

		// when
		seedRandom('test2');

		m = motif(Dbm6, '2:0:0', normal);

		expect(m).to.eql([
			{ time: 0, note: 'Ab4', midi: 68, dur: '4n.' },
			{ time: '128i', note: 'Ab4', midi: 68, dur: '4t' },
			{ time: '256i', note: 'E4', midi: 63, dur: '4t' },
			{ time: '352i', note: 'E4', midi: 63, dur: '8n' },
			{ time: '640i', note: 'E4', midi: 63, dur: '4n.' },
			{ time: '736i', note: 'Ab4', midi: 68, dur: '8n' },
			{ time: '1024i', note: 'Ab4', midi: 68, dur: '4n.' },
			{ time: '1152i', note: 'Db4', midi: 61, dur: '4t' },
			{ time: '1248i', note: 'Bb4', midi: 70, dur: '8n' },
		]);
	});
});
