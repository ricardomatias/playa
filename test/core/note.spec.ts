import { Note } from '../../lib/core/Note';

describe('Note Test Suite', () => {
	it('should set natural', () => {
		const note = new Note('A');

		expect(note.n).toBe('A');
		expect(note.e).toBeUndefined();
	});

	it('should set sharp', () => {
		const note = new Note('D#');

		expect(note.n).toBe('D#');
		expect(note.e).toBe('Eb');
	});

	it('should set flat', () => {
		const note = new Note('Gb');

		expect(note.n).toBe('Gb');
		expect(note.e).toBe('F#');
	});

	it('should set with MIDI', () => {
		const note = new Note(60);

		expect(note.n).toBe('C3');
		expect(note.toString()).toEqual('[object Note: C3]');
		expect(note.m).toBe(60);
		expect(note.note).toBe('C');
		expect(note.e).toBeUndefined();
	});

	it('should strip octave from note', () => {
		const note = new Note('F#6');
		const note2 = new Note('Gb8');

		expect(note.n).toBe('F#6');
		expect(note.note).toBe('F#');

		expect(note2.n).toBe('Gb8');
		expect(note2.note).toBe('Gb');
	});

	it('should have unstateful regexp', () => {
		const a = new Note('D3').n;
		const b = new Note('D3').n;
		const c = new Note('D').n;
		const d = new Note('D').n;

		expect(a).toBe('D3');
		expect(b).toBe('D3');
		expect(c).toBe('D');
		expect(d).toBe('D');
	});

	it('should get octave with MIDI', () => {
		const note = new Note('F#', 102);

		expect(note.n).toBe('F#6');
		expect(note.note).toBe('F#');
		expect(note.e).toBe('Gb');
	});

	it('should get enharmonic with MIDI', () => {
		const note = new Note(102);

		expect(note.eoct).toBe('Gb6');
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

		expect(next.n).toBe('G3');
		expect(next.note).toBe('G');
		expect(next.e).toBeUndefined();
		expect((next.midi ?? 0) - (note.midi ?? 0)).toBe(1);
	});

	it('should get neighbors as sharps by default', () => {
		const note = new Note('A');

		expect(note.next.n).toBe('A#');
		expect(note.prev.n).toBe('G#');
	});

	it('should get accident neighbors', () => {
		const note = new Note('Gb');

		expect(note.next.n).toBe('G');
		expect(note.prev.n).toBe('F');
	});

	it('should get edge "B" neighbors', () => {
		const note = new Note('B');

		expect(note.next.n).toBe('C');
		expect(note.prev.n).toBe('A#');
	});

	it('should get edge "C" neighbors', () => {
		const note = new Note('C');

		expect(note.next.n).toBe('C#');
		expect(note.prev.n).toBe('B');
	});

	it('should have next', () => {
		let note = new Note('C-2');

		expect(note.midi).toBe(0);
		note = note.next;
		expect(note.n).toBe('C#-2');
		expect(note.midi).toBe(1);
		note = note.next;
		expect(note.n).toBe('D-2');
		expect(note.midi).toBe(2);
		note = note.next;
		expect(note.n).toBe('D#-2');
		expect(note.midi).toBe(3);
		note = note.next;
		expect(note.n).toBe('E-2');
		expect(note.midi).toBe(4);
	});

	it('should fail with midi over the range', () => {
		expect(() => (new Note(200))).toThrowError('[Note]: <200> isn\'t a valid midi note number');
	});

	it('should fail with midi over the range', () => {
		expect(() => (new Note('Ab11'))).toThrowError('[Note]: <Ab11> isn\'t within the midi range of [0 - 127]');
	});

	it('should not set UNKNOWN', () => {
		expect(() => (new Note('foo'))).toThrowError('[Note]: <foo> isn\'t a recognized musical note');
	});

	it('should not set UNKNOWN ENHARMONIC', () => {
		expect(() => (new Note('Cb'))).toThrowError('[Note]: <Cb> isn\'t a recognized musical note');
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
});
