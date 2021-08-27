import random, { Random } from '../../lib/tools/random';
import { mapRepeat } from '../../lib/tools/map-repeat';

describe('A Random test suite', () => {
	it('should return singleton', () => {
		random.setSeed('test');

		expect(random.int(10)).toEqual(6);

		random.setSeed('test');

		expect(random.int(10)).toEqual(6);
	});

	it('should create new random int', () => {
		random.setSeed('test');

		const results = mapRepeat(10, () => random.int(10, 5));

		expect(results.filter((n) => n >= 5 && n <= 10)).toHaveLength(10);
		expect(results).toMatchInlineSnapshot(`
Array [
  8,
  9,
  7,
  7,
  6,
  7,
  7,
  5,
  6,
  8,
]
`);
	});

	it('should create new random float', () => {
		random.setSeed('test');

		const results = mapRepeat(10, () => random.float(10, 5));

		expect(results.filter((n) => n >= 5 && n <= 10)).toHaveLength(10);
		expect(results.map((n) => n.toFixed(3))).toMatchInlineSnapshot(`
Array [
  "7.753",
  "8.700",
  "6.696",
  "6.773",
  "6.399",
  "6.916",
  "6.917",
  "5.365",
  "6.253",
  "8.275",
]
`);
	});

	it('should create new random boolean', () => {
		const rnd = new Random();

		expect(rnd.boolean()).toBe(false);
	});

	it('should keep state', () => {
		random.setSeed('test');

		expect(random.int(5)).toEqual(3);
		expect(random.int(10)).toEqual(8);
		expect(random.int(100)).toEqual(34);

		random.push();

		expect(random.int(5)).toEqual(3);
		expect(random.int(10)).toEqual(8);
		expect(random.int(100)).toEqual(34);

		expect(random.int(1000)).toEqual(355);

		random.pop();

		expect(random.int(1000)).toEqual(355);
	});
});
