import Note from '../../lib/core/Note';

describe('Note Test Suite', () => {
	it('should set natural', () => {
		const note = new Note('A');

		expect(note.n).toBe('A');
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
		const note = new Note('C', 60);

		expect(note.n).toBe('C3');
		expect(note.m).toBe(60);
		expect(note.note).toBe('C');
	});

	it('should get octave with MIDI', () => {
		const note = new Note('Gb', 102);

		expect(note.n).toBe('Gb6');
		expect(note.note).toBe('Gb');
	});

	it('should get enharmonic with MIDI', () => {
		const note = new Note('Gb', 102);

		expect(note.eoct).toBe('F#6');
		expect(note.e).toBe('F#');
	});

	it('should get Gb freq based on MIDI', () => {
		const note = new Note('Gb', 102);

		expect(Math.round(note.f)).toBe(2960);
	});

	it('should get A freq based on MIDI', () => {
		const note = new Note('A', 69);

		expect(Math.round(note.f)).toBe(440);
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

	it('should not set UNKNOWN', () => {
		const note = new Note('foo');

		expect(note.n).toBeNull();
		expect(note.e).toBeNull();
	});

	it('should not set UNKNOWN ENHARMONIC', () => {
		const note = new Note('Cb');

		expect(note.n).toBeNull();
		expect(note.e).toBeNull();
	});

	it('should get distC', () => {
		const note = new Note('A');

		expect(note.distC).toBe(9);
	});
});
