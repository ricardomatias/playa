import { chooseRepeatable, choose, chooseMany } from '../../lib/tools/choose';
import random from '../../lib/tools/random';

const AM7 = [ 'A', 'C', 'E', 'G' ];

describe('A Choose test suite', () => {
	it('should return a random element', () => {
		random.setSeed('CHOOSE');

		expect(choose(AM7)).toBe('E');
	});

	it('should return 2 random elements basic', () => {
		random.setSeed('CHOOSE');

		expect(chooseMany(AM7, 2)).toMatchInlineSnapshot(`
		Array [
		  "E",
		  "G",
		]
	`);
	});

	it('should return 2 random elements but never a C', () => {
		random.setSeed('CHOOSE');

		expect(chooseMany(AM7, 2, 'C')).toMatchInlineSnapshot(`
		Array [
		  "E",
		  "G",
		]
	`);
	});

	it('should return 10 repeatable elements', () => {
		random.setSeed('CHOOSE');

		const elements = chooseRepeatable([ 'A', 'C', 'E' ], 10);
		expect(elements).toMatchInlineSnapshot(`
		Array [
		  "C",
		  "E",
		  "C",
		  "A",
		  "C",
		  "A",
		  "C",
		  "A",
		  "C",
		  "A",
		]
	`);
	});
});
