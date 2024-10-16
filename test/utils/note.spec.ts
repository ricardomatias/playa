import { describe, it, expect } from 'vitest';
import { findCMidiByOctave, findOctave } from '../../lib/utils/note';

describe('A Notes Util Test Suite', () => {
	it('should find octave for C3', () => {
		expect(findOctave(60)).toEqual(3);
	});

	it('should find midi by octave', () => {
		expect(findCMidiByOctave(-2)).toEqual(0);
		expect(findCMidiByOctave(0)).toEqual(24);
		expect(findCMidiByOctave(3)).toEqual(60);
		expect(findCMidiByOctave(7)).toEqual(108);
	});
});
