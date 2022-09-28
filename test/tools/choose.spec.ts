import { mapRepeat } from '../../lib/tools';
import { chooseRepeatable, choose, chooseMany } from '../../lib/tools/choose';
import random from '../../lib/tools/random';

const AM7 = ['A', 'C', 'E', 'G'];

describe('A Choose test suite', () => {
	beforeEach(random.reset);

	it('should return a random element', () => {
		random.setSeed('CHOOSE');

		expect(mapRepeat(10, () => choose(AM7))).toMatchInlineSnapshot(`
		[
		  "E",
		  "C",
		  "C",
		  "C",
		  "C",
		  "A",
		  "C",
		  "E",
		  "C",
		  "E",
		]
	`);
	});

	it('should return 2 random elements basic', () => {
		random.setSeed('CHOOSE');

		expect(chooseMany(AM7, 2)).toMatchInlineSnapshot(`
		[
		  "E",
		  "A",
		]
	`);
	});

	it('should return 2 random elements but never a C', () => {
		random.setSeed('CHOOSE');

		expect(chooseMany(AM7, 2, 'C')).toMatchInlineSnapshot(`
		[
		  "E",
		  "A",
		]
	`);
	});

	it('should return 10 repeatable elements', () => {
		random.setSeed('CHOOSE');

		const elements = chooseRepeatable(['A', 'C', 'E'], 10);
		expect(elements).toMatchInlineSnapshot(`
		[
		  "C",
		  "A",
		  "C",
		  "A",
		  "C",
		  "E",
		  "C",
		  "E",
		  "C",
		  "E",
		]
	`);
	});
});
