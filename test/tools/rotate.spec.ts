import { describe, it, expect } from 'vitest';
import random from '../../lib/tools/random';
import { rotate } from '../../lib/tools';

const AM7 = ['A', 'C', 'E', 'G', 'B', 'Eb'];

describe('A Rotate test suite', () => {
	it('should rotate the array', () => {
		random.setSeed('test');

		let rotatedAM7 = rotate(AM7);

		expect(rotatedAM7).toEqual(['C', 'E', 'G', 'B', 'Eb', 'A']);

		rotatedAM7 = rotate(AM7, 3);

		expect(rotatedAM7).toEqual(['G', 'B', 'Eb', 'A', 'C', 'E']);
	});

	it('should shift the array', () => {
		random.setSeed('test');

		let shifted = rotate(AM7, -1);

		expect(shifted).toEqual(['Eb', 'A', 'C', 'E', 'G', 'B']);

		shifted = rotate(AM7, -3);

		expect(shifted).toEqual(['G', 'B', 'Eb', 'A', 'C', 'E']);
	});
});
