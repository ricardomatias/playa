import { describe, it, expect } from 'vitest';
import { parseHarmonicShift } from '../../lib/utils/harmonic';

describe('A Harmonic Test Suite', () => {
	it('should work', () => {
		expect(parseHarmonicShift('+1')).toEqual({ position: 1, octaveShift: 1 });
		expect(parseHarmonicShift(1)).toEqual({ position: 1, octaveShift: 0 });
		expect(parseHarmonicShift('+5')).toEqual({ position: 5, octaveShift: 1 });
		expect(parseHarmonicShift('++7')).toEqual({ position: 7, octaveShift: 2 });
		expect(parseHarmonicShift('--3')).toEqual({ position: 3, octaveShift: -2 });
		expect(parseHarmonicShift('-2')).toEqual({ position: 2, octaveShift: -1 });
	});
});
