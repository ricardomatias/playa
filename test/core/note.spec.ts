import { describe, it, expect } from 'vitest';
import { Note } from '../../lib/core/Note';
import { mapNotesToString } from '../../lib/utils/map';

describe('Note Test Suite', () => {
	it('should set natural', () => {
		const note = new Note('A');

		expect(note.pitch).toBe('A3');
		expect(note.midi).toBe(69);
		expect(note.e).toBe('A');
	});

	it('should set sharp', () => {
		const note = new Note('D#');

		expect(note.pitch).toBe('D#3');
		expect(note.midi).toBe(63);
		expect(note.e).toBe('Eb');
	});

	it('should set flat', () => {
		const note = new Note('Gb');

		expect(note.pitch).toBe('Gb3');
		expect(note.midi).toBe(66);
		expect(note.e).toBe('F#');
	});

	it('should set with MIDI', () => {
		const note = new Note(60);

		expect(note.pitch).toBe('C3');
		expect(note.note).toBe('C');
		expect(note.toString()).toEqual('[object Note: C3]');
		expect(note.m).toBe(60);
		expect(note.note).toBe('C');
		expect(note.e).toBe('C');
	});

	it('should strip octave from note', () => {
		const note = new Note('F#6');
		const note2 = new Note('Gb8');
		const note3 = new Note('A4');

		expect(note.pitch).toBe('F#6');
		expect(note.note).toBe('F#');

		expect(note2.pitch).toBe('Gb8');
		expect(note2.note).toBe('Gb');

		expect(note3.pitch).toBe('A4');
		expect(note3.note).toBe('A');
	});

	it('should have unstateful regexp', () => {
		const a = new Note('D4').pitch;
		const b = new Note('D4').pitch;
		const c = new Note('D').pitch;
		const d = new Note('D').pitch;

		expect(a).toBe('D4');
		expect(b).toBe('D4');
		expect(c).toBe('D3');
		expect(d).toBe('D3');
	});

	it('should get octave with MIDI', () => {
		const note = new Note('F#', 102);

		expect(note.pitch).toBe('F#6');
		expect(note.note).toBe('F#');
		expect(note.e).toBe('Gb');
	});

	it('should get enharmonic with MIDI', () => {
		const note = new Note(102);

		expect(note.enharmonicPitch).toBe('Gb6');
		expect(note.e).toBe('Gb');
	});

	it('should get Gb freq based on MIDI', () => {
		const note = new Note(102);

		expect(Math.round(note.f as number)).toBe(2960);
	});

	it('should get A freq based on MIDI', () => {
		const note = new Note(69);

		expect(Math.round(note.f as number)).toBe(440);
	});

	it('should get next with MIDI', () => {
		const note = new Note('F#3');
		const next = note.next;

		expect(next.pitch).toBe('G3');
		expect(next.note).toBe('G');
		expect(next.e).toBe('G');
		expect((next.midi ?? 0) - (note.midi ?? 0)).toBe(1);
	});

	it('should get neighbors as sharps by default', () => {
		const note = new Note('A');

		expect(note.next.pitch).toBe('A#3');
		expect(note.prev.pitch).toBe('G#3');
	});

	it('should get accident neighbors', () => {
		const note = new Note('Gb');

		expect(note.next.pitch).toBe('G3');
		expect(note.prev.pitch).toBe('F3');
	});

	it('should get edge "B" neighbors', () => {
		const note = new Note('B');

		expect(note.next.pitch).toBe('C4');
		expect(note.prev.pitch).toBe('A#3');
	});

	it('should get edge "C" neighbors', () => {
		const note = new Note('C');

		expect(note.next.pitch).toBe('C#3');
		expect(note.prev.pitch).toBe('B2');
	});

	it('should have next', () => {
		let note = new Note('C-2');

		expect(note.midi).toBe(0);
		note = note.next;
		expect(note.pitch).toBe('C#-2');
		expect(note.midi).toBe(1);
		note = note.next;
		expect(note.pitch).toBe('D-2');
		expect(note.midi).toBe(2);
		note = note.next;
		expect(note.pitch).toBe('D#-2');
		expect(note.midi).toBe(3);
		note = note.next;
		expect(note.pitch).toBe('E-2');
		expect(note.midi).toBe(4);
	});

	it('should fail with midi over the range', () => {
		expect(() => new Note(200)).toThrowError("[Note]: <200> isn't a valid midi note number");
	});

	it('should fail with midi over the range', () => {
		expect(() => new Note('Ab11' as any)).toThrowError("[Note]: <Ab11> isn't within the midi range of [0 - 127]");
	});

	it('should not set UNKNOWN', () => {
		expect(() => new Note('foo' as any)).toThrowError("[Note]: <foo> isn't a recognized musical note");
	});

	it('should not set UNKNOWN ENHARMONIC', () => {
		expect(() => new Note('Cb' as any)).toThrowError("[Note]: <Cb> isn't a recognized musical note");
	});

	it('should get distC', () => {
		const note = new Note('A');

		expect(note.distC).toBe(9);
	});

	it('should equal itself', () => {
		const note = new Note('A');

		expect(note.equals(note)).toBeTruthy();
	});

	it('should equal enharmonic same octave', () => {
		const a = new Note('C#3');
		const b = new Note('Db3');

		expect(a.equals(b)).toBeTruthy();
	});

	it('should equal enharmonic different octave', () => {
		const a = new Note('C#3');
		const b = new Note('Db4');

		expect(a.equals(b)).toBeTruthy();
	});

	it('should get range of notes', () => {
		const range = mapNotesToString(Note.range('C2', 'C3'));

		expect(range).toMatchInlineSnapshot(`
		[
		  "C2",
		  "C#2",
		  "D2",
		  "D#2",
		  "E2",
		  "F2",
		  "F#2",
		  "G2",
		  "G#2",
		  "A2",
		  "A#2",
		  "B2",
		]
	`);
	});

	describe('#position', () => {
		it('should return C position', () => {
			const dist = Note.position('C');

			expect(dist).toBe(0);
		});

		it('should return Eb position', () => {
			const dist = Note.position('Eb');

			expect(dist).toBe(3);
		});

		it('should return A# position', () => {
			const dist = Note.position('A#');

			expect(dist).toBe(10);
		});
	});

	describe('#transposeUp', () => {
		it('should return the transposed of: C, 2M', () => {
			const newNote = Note.transposeUp('C', '2M');

			expect(newNote).toBe('D');
		});

		it('should return the transposed of: C, 3m', () => {
			const newNote = Note.transposeUp('C', '3m');

			expect(newNote).toBe('Eb');
		});

		it('should return the transposed of: A, 3m', () => {
			const newNote = Note.transposeUp('A4', '3m');

			expect(newNote).toBe('C');
		});

		it('should return the transposed of: Db, 4P', () => {
			const newNote = Note.transposeUp('Db', '4P');

			expect(newNote).toBe('Gb');
		});

		it('should return the transposed of: F#, A#', () => {
			const newNote = Note.transposeUp('F#', '3M');

			expect(newNote).toBe('A#');
		});

		it('should return the transposed of: Gb, Db', () => {
			const newNote = Note.transposeUp('Gb', '5P');

			expect(newNote).toBe('Db');
		});

		it('should return the transposed of: B, C', () => {
			const newNote = Note.transposeUp('B', '2m');

			expect(newNote).toBe('C');
		});

		it('should return the transposed of: Gb, E', () => {
			const newNote = Note.transposeUp('Gb', '7m');

			expect(newNote).toBe('E');
		});
	});

	describe('#transposeDown', () => {
		it('should return the transposed of: C, 2M', () => {
			const newNote = Note.transposeDown('C', '2M');

			expect(newNote).toBe('Bb');
		});

		it('should return the transposed of: Db, 4P', () => {
			const newNote = Note.transposeDown('Db', '4P');

			expect(newNote).toBe('Ab');
		});

		it('should return the transposed of: F#, 3M', () => {
			const newNote = Note.transposeDown('F#', '3M');

			expect(newNote).toBe('D');
		});

		it('should return the transposed of: Gb, 5P', () => {
			const newNote = Note.transposeDown('Gb', '5P');

			expect(newNote).toBe('B');
		});

		it('should return the transposed of: B, 2m', () => {
			const newNote = Note.transposeDown('B', '2m');

			expect(newNote).toBe('A#');
		});

		it('should return the transposed of: Gb, 7m', () => {
			const newNote = Note.transposeDown('Gb', '7m');

			expect(newNote).toBe('Ab');
		});
	});
});
