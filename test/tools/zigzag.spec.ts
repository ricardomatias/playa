import { describe, it, expect } from 'vitest';
import { mapRepeat, zigzag } from '../../lib/tools';

const AM7 = ['A', 'C', 'E', 'G'];

describe('zigzag test suite', () => {
	it('should pick default zigzag - 2 FW 1 BK', () => {
		// given
		const nextNote = zigzag(AM7);

		// when
		const result = mapRepeat(8, nextNote);

		expect(result).toEqual(['A', 'E', 'C', 'G', 'E', 'A', 'G', 'C']);
	});

	it('should pick zigzag - 3 FW 2 BK', () => {
		// given
		const nextNote = zigzag(AM7, 3, 2);

		// when
		const result = mapRepeat(8, nextNote);

		expect(result).toEqual(['A', 'G', 'C', 'A', 'E', 'C', 'G', 'E']);
	});

	it('should pick zigzag - 1 FW 2 BK', () => {
		// given
		const nextNote = zigzag(AM7, 1, 2);

		// when
		const result = mapRepeat(8, nextNote);

		expect(result).toEqual(['A', 'C', 'G', 'A', 'E', 'G', 'C', 'E']);
	});
});
