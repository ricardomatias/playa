const Chord = require('../lib/Chord');

describe('Chord Test Suite', () => {
	it('should set natural', () => {
		const chord = new Chord('Am7');

		expect(chord.r).to.eql('A');
		expect(chord.q).to.eql('m');
		expect(chord.ext).to.eql(['7']);
		expect(chord.n).to.eql(['A', 'C', 'E', 'G']);
	});

	it('should set sharp', () => {
		const chord = new Chord('D#m6');

		expect(chord.r).to.eql('D#');
		expect(chord.q).to.eql('m');
		expect(chord.ext).to.eql(['6']);
		expect(chord.n).to.eql(['D#', 'F#', 'A#', 'C']);
	});

	it('should set flat', () => {
		const chord = new Chord('Bbm9');

		expect(chord.r).to.eql('Bb');
		expect(chord.q).to.eql('m');
		expect(chord.ext).to.eql(['9']);
		expect(chord.n).to.eql(['Bb', 'Db', 'F', 'Ab', 'C']);
	});

	it('should set 13 chord', () => {
		const chord = new Chord('E13');

		expect(chord.r).to.eql('E');
		expect(chord.q).to.eql('M');
		expect(chord.ext).to.eql(['13']);
		expect(chord.n).to.eql(['E', 'G#', 'B', 'D', 'F#', 'C#']);
	});

	it('should set m11 chord', () => {
		const chord = new Chord('Gbm11');

		expect(chord.r).to.eql('Gb');
		expect(chord.q).to.eql('m');
		expect(chord.ext).to.eql(['11']);
		expect(chord.n).to.eql(['Gb', 'A', 'Db', 'E', 'Ab', 'B']);
	});
});
