import { next } from '../../lib/tools';

const AM = ['A', 'C', 'E'];

describe('next test suite', () => {
	it('should pick the next note', () => {
		const nextNote = next(AM);

		expect(nextNote()).toBe('A');
		expect(nextNote()).toBe('C');
		expect(nextNote()).toBe('E');
		expect(nextNote()).toBe('A');
	});

	it('should pick the reverse it reaches the end', () => {
		const nextNote = next(AM, true);

		expect(nextNote()).toBe('A');
		expect(nextNote()).toBe('C');
		expect(nextNote()).toBe('E');
		expect(nextNote()).toBe('C');
	});
});
