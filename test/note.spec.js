import Note from '../lib/Note';

describe('Note Test Suite', () => {
	it('should set natural', () => {
		const note = new Note('A');

		expect(note.n).to.eql('A');
	});

	it('should set sharp', () => {
		const note = new Note('D#');

		expect(note.n).to.eql('D#');

		expect(note.e).to.eql('Eb');
	});

	it('should set flat', () => {
		const note = new Note('Gb');

		expect(note.n).to.eql('Gb');

		expect(note.e).to.eql('F#');
	});

	it('should set with MIDI', () => {
		const note = new Note('C', 60);

		expect(note.n).to.eql('C');
		expect(note.m).to.eql(60);
	});

	it('should get octave with MIDI', () => {
		const note = new Note('Gb', 102);

		expect(note.noct).to.eql('Gb7');
	});

	it('should get enharmonic with MIDI', () => {
		const note = new Note('Gb', 102);

		expect(note.eoct).to.eql('F#7');
	});

	it('should get Gb freq based on MIDI', () => {
		const note = new Note('Gb', 102);

		expect(Math.round(note.f)).to.eql(2960);
	});

	it('should get A freq based on MIDI', () => {
		const note = new Note('A', 69);

		expect(Math.round(note.f)).to.eql(440);
	});

	it('should get neighbors as sharps by default', () => {
		const note = new Note('A');

		expect(note.next.n).to.eql('A#');
		expect(note.prev.n).to.eql('G#');
	});

	it('should get accident neighbors', () => {
		const note = new Note('Gb');

		expect(note.next.n).to.eql('G');
		expect(note.prev.n).to.eql('F');
	});

	it('should get edge "B" neighbors', () => {
		const note = new Note('B');

		expect(note.next.n).to.eql('C');
		expect(note.prev.n).to.eql('A#');
	});

	it('should get edge "C" neighbors', () => {
		const note = new Note('C');

		expect(note.next.n).to.eql('C#');
		expect(note.prev.n).to.eql('B');
	});

	it('should not set UNKNOWN', () => {
		const note = new Note('foo');

		expect(note.n).to.be.null;
		expect(note.e).to.be.null;
	});

	it('should not set UNKNOWN ENHARMONIC', () => {
		const note = new Note('Cb');

		expect(note.n).to.be.null;
		expect(note.e).to.be.null;
	});
});
