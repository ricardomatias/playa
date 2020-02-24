import Scale from '../../lib/core/Scale';

describe('Scale Test Suite', () => {
	describe('types', () => {
		it('should return MIDI', () => {
			const scale = new Scale('C', Scale.MAJOR);

			expect(scale).toHaveMidiNotes([ 60, 62, 64, 65, 67, 69, 71 ]);
		});
	});

	describe('#_createScale', () => {
		it('should create scale - chromatic', () => {
			const scale = new Scale('C', Scale.CHROMATIC);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
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
			const scale = new Scale('C', Scale.MAJOR);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
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
			const scale = new Scale('G#', Scale.MINOR);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
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
			const scale = new Scale('Db', Scale.LYDIAN);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
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
			const scale = new Scale('A', Scale.LOCRIAN);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
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
			const scale = new Scale('G', Scale.PHRYGIAN);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
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
			const scale = new Scale('C', Scale.MINOR_PENTATONIC);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
			  "C3",
			  "D#3",
			  "F3",
			  "G3",
			  "A#3",
			]
		`);
		});

		it('should create scale - MELODIC_MINOR', () => {
			const scale = new Scale('C', Scale.MELODIC_MINOR);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
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
			const scale = new Scale('F#', Scale.ALTERED);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
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
			const scale = new Scale('B', Scale.LYDIAN);

			expect(scale.string).toMatchInlineSnapshot(`
			Array [
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
});
