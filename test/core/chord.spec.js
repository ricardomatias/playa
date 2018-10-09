import Chord from '../../lib/core/Chord';

const TEST = { noteType: 'str' };

describe('Chord Test Suite', () => {
	it('should return MIDI by default', () => {
		const chord = new Chord('Am7', TEST);

		expect(chord.root).to.eql('A');
		expect(chord.type).to.eql('m');
		expect(chord.ext).to.eql([ '7' ]);
		expect(chord.notes).to.eql([ 'A4', 'C5', 'E5', 'G5' ]);
	});

	it('should set natural', () => {
		const chord = new Chord('Am7', TEST);

		expect(chord.root).to.eql('A');
		expect(chord.type).to.eql('m');
		expect(chord.ext).to.eql([ '7' ]);
		expect(chord.notes).to.eql([ 'A4', 'C5', 'E5', 'G5' ]);
	});

	it('should set sharp', () => {
		const chord = new Chord('D#m6', TEST);

		expect(chord.root).to.eql('D#');
		expect(chord.type).to.eql('m');
		expect(chord.ext).to.eql([ '6' ]);
		expect(chord.notes).to.eql([ 'D#4', 'F#4', 'A#4', 'C5' ]);
	});

	it('should set flat', () => {
		const chord = new Chord('Bbm9', TEST);

		expect(chord.root).to.eql('Bb');
		expect(chord.type).to.eql('m');
		expect(chord.ext).to.eql([ '9' ]);
		expect(chord.notes).to.eql([ 'Bb4', 'Db5', 'F5', 'Ab5', 'C6' ]);
	});

	it('should set 13 chord', () => {
		const chord = new Chord('E13', TEST);

		expect(chord.root).to.eql('E');
		expect(chord.type).to.eql('M');
		expect(chord.ext).to.eql([ '13' ]);
		expect(chord.notes).to.eql([ 'E4', 'G#4', 'B4', 'D5', 'F#5', 'C#6' ]);
	});

	it('should set m11 chord', () => {
		const chord = new Chord('Gbm11', TEST);

		expect(chord.root).to.eql('Gb');
		expect(chord.type).to.eql('m');
		expect(chord.ext).to.eql([ '11' ]);
		expect(chord.notes).to.eql([ 'Gb4', 'A4', 'Db5', 'E5', 'Ab5', 'B5' ]);
	});
});
