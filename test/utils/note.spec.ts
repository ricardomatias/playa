import { findBaseMidiByOctave, findOctave } from '../../lib/utils/note';

describe('A Notes Util Test Suite', () => {
	it('should find octave for C3', () => {
		expect(findOctave(60)).toEqual(3);
	});

	it('should find midi by octave', () => {
		expect(findBaseMidiByOctave(-2)).toEqual(0);
		expect(findBaseMidiByOctave(0)).toEqual(24);
		expect(findBaseMidiByOctave(3)).toEqual(60);
		expect(findBaseMidiByOctave(7)).toEqual(108);
	});
});
