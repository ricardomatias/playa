import { ring } from '../../lib/tools';

const AM7 = [ 'A', 'C', 'E', 'G' ];

describe('A Ring test suite', () => {
	it('should create a ring', () => {
		const am7 = ring(AM7);

		expect(am7[0]).toBe('A');
		expect(am7[4]).toBe('A');
		expect(am7[-4]).toBe('A');

		expect(am7[3]).toBe('G');
		expect(am7[-1]).toBe('G');
		expect(am7[7]).toBe('G');
	});

	it('should return a new ring', () => {
		const am7 = ring(AM7);
		const am7b = ring(AM7);

		expect(am7).not.toBe(am7b);
	});
});
