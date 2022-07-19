import random from '../../lib/tools/random';
import { Sequence } from '../../lib/composition';
import { Key, Chord, Scale } from '../../lib/core';

describe('A Sequence test suite', () => {
	it('should create a sequence of notes', () => {
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);
		const seq = new Sequence(scale).I.II.V;

		expect(seq.pitches).toEqual(['A3', 'B3', 'E4']);
		expect(seq.toString()).toEqual('[object Sequence: A3,B3,E4]');
	});

	it('should reset a sequence of notes', () => {
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);
		const seq = new Sequence(scale).I.II.V;

		expect(seq.pitches).toEqual(['A3', 'B3', 'E4']);

		seq.reset();

		expect(seq.toString()).toEqual('[object Sequence: ]');
	});

	it('should create a sequence of notes with 2 octaves', () => {
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major, [3, 2]);

		const seq = new Sequence(scale).II.V.VI.pitches;

		expect(seq).toEqual(['B3', 'E4', 'F#4', 'B4', 'E5', 'F#5']);
	});

	it('should create a sequence of chords', () => {
		random.setSeed('test');

		const key = new Key('A', Key.Major, [3, 1], { chordStructure: Chord.Structures.Triad });

		const chords = new Sequence(key).II.V.VI.chords;

		expect(chords.string).toEqual(['Bm', 'Emaj', 'F#m']);
		expect(chords.midi).toMatchInlineSnapshot(`
		Array [
		  Array [
		    71,
		    74,
		    78,
		  ],
		  Array [
		    64,
		    68,
		    71,
		  ],
		  Array [
		    66,
		    69,
		    73,
		  ],
		]
	`);
	});

	it('should create a way too long sequence', () => {
		random.setSeed('test');

		const key = new Key('A', Key.Major, [3, 2], { chordStructure: Chord.Structures.Seventh });

		const chords = new Sequence(key).II.I.V.VI.V.VI.I.III.VII.chords;

		expect(chords.string).toEqual(['Bm7', 'AM7', 'E7', 'F#m7', 'E7', 'F#m7', 'AM7', 'C#m7', 'G#m7b5']);
		expect(chords.midi).toEqual([
			[71, 74, 78, 81, 83, 86, 90, 93],
			[69, 73, 76, 80, 81, 85, 88, 92],
			[64, 68, 71, 74, 76, 80, 83, 86],
			[66, 69, 73, 76, 78, 81, 85, 88],
			[64, 68, 71, 74, 76, 80, 83, 86],
			[66, 69, 73, 76, 78, 81, 85, 88],
			[69, 73, 76, 80, 81, 85, 88, 92],
			[61, 64, 68, 71, 73, 76, 80, 83],
			[68, 71, 74, 78, 80, 83, 86, 90],
		]);
	});
});
