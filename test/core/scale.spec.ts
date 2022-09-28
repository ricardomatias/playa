import { Scale, Note } from '../../lib/core';
import '../matchers';

describe('Scale Test Suite', () => {
	describe('types', () => {
		it('should return MIDI', () => {
			const scale = new Scale('C', Scale.Major);

			expect(scale.toString()).toEqual('[object Scale: C3,D3,E3,F3,G3,A3,B3]');
			expect(scale).toHaveMidiNotes([60, 62, 64, 65, 67, 69, 71]);
		});

		it('should return SHARP MIDI', () => {
			const scale = new Scale('D#', Scale.Major);

			expect(scale.toString()).toEqual('[object Scale: Eb3,F3,G3,Ab3,Bb3,C4,D4]');
			expect(scale).toHaveMidiNotes([63, 65, 67, 68, 70, 72, 74]);
		});
	});

	describe('#_createScale', () => {
		it('should create scale - chromatic', () => {
			const scale = new Scale('C', Scale.Intervals.Chromatic);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "C3",
			  "C#3",
			  "D3",
			  "D#3",
			  "E3",
			  "F3",
			  "F#3",
			  "G3",
			  "G#3",
			  "A3",
			  "A#3",
			  "B3",
			]
		`);
		});

		it('should create scale - natural', () => {
			const scale = new Scale('C', Scale.Major);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "C3",
			  "D3",
			  "E3",
			  "F3",
			  "G3",
			  "A3",
			  "B3",
			]
		`);
		});

		it('should create scale - sharp', () => {
			const scale = new Scale('G#', Scale.Minor);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "G#3",
			  "A#3",
			  "B3",
			  "C#4",
			  "D#4",
			  "E4",
			  "F#4",
			]
		`);
		});

		it('should create scale - flat', () => {
			const scale = new Scale('Db', Scale.Lydian);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "Db3",
			  "Eb3",
			  "F3",
			  "G3",
			  "Ab3",
			  "Bb3",
			  "C4",
			]
		`);
		});

		it('should create scale - locrian', () => {
			const scale = new Scale('A', Scale.Locrian);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "A3",
			  "Bb3",
			  "C4",
			  "D4",
			  "Eb4",
			  "F4",
			  "G4",
			]
		`);
		});

		it('should create scale - phrygian', () => {
			const scale = new Scale('G', Scale.Phrygian);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "G3",
			  "Ab3",
			  "Bb3",
			  "C4",
			  "D4",
			  "Eb4",
			  "F4",
			]
		`);
		});

		it('should create scale - pentatonic', () => {
			const scale = new Scale('C', Scale.Intervals.MinorPentatonic);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "C3",
			  "D#3",
			  "F3",
			  "G3",
			  "A#3",
			]
		`);
		});

		it('should create scale - MELODIC_MINOR', () => {
			const scale = new Scale('C', Scale.Intervals.MelodicMinor);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "C3",
			  "D3",
			  "Eb3",
			  "F3",
			  "G3",
			  "A3",
			  "B3",
			]
		`);
		});

		it('should create scale - ALTERED', () => {
			const scale = new Scale('F#', Scale.Intervals.Altered);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "F#3",
			  "G3",
			  "A3",
			  "A#3",
			  "C4",
			  "D4",
			  "E4",
			]
		`);
		});

		it('should create scale - LYDIAN', () => {
			const scale = new Scale('B', Scale.Lydian);

			expect(scale.pitches).toMatchInlineSnapshot(`
			[
			  "B3",
			  "C#4",
			  "D#4",
			  "F4",
			  "F#4",
			  "G#4",
			  "A#4",
			]
		`);
		});
	});

	describe('#noteAt', () => {
		it('should get root', () => {
			const scale = new Scale('A', Scale.Minor);
			const root = scale.noteAt(1);

			expect(root).toBeInstanceOf(Note);
			expect(root.pitch).toEqual('A3');
		});

		it('should get structure notes', () => {
			const scale = new Scale('A', Scale.Minor);
			const third = scale.noteAt(3);
			const fifth = scale.noteAt(5);
			const seventh = scale.noteAt(7);

			expect(third.pitch).toEqual('C4');
			expect(fifth.pitch).toEqual('E4');
			expect(seventh.pitch).toEqual('G4');
		});

		it("should throw when it doesn't have interval", () => {
			const toThrow = () => {
				const scale = new Scale('A', Scale.Minor);
				scale.noteAt(11 as any);
			};

			expect(toThrow).toThrowErrorMatchingInlineSnapshot(`"[1P 2M 3m 4P 5P 6m 7m] structure doesn't contain interval: 11"`);
		});
	});
});
