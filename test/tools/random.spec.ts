import random, { Random } from '../../lib/tools/random';
import { mapRepeat } from '../../lib/tools/map-repeat';

describe('A Random test suite', () => {
	it('should return singleton', () => {
		const result = mapRepeat(10, () => {
			random.setSeed('test');

			return random.int(10);
		}).every((v) => !!v);

		expect(result).toBeTruthy();
	});

	it('should create new random int', () => {
		random.setSeed('test');

		const results = mapRepeat(10, () => random.int(10, 5));

		expect(results.filter((n) => n >= 5 && n <= 10)).toHaveLength(10);
		expect(results).toMatchInlineSnapshot(`
		Array [
		  7,
		  6,
		  6,
		  7,
		  5,
		  6,
		  6,
		  8,
		  8,
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
		  "7.373",
		  "6.428",
		  "6.259",
		  "7.137",
		  "5.220",
		  "6.585",
		  "6.335",
		  "7.507",
		  "7.824",
		  "8.275",
		]
	`);
	});

	it('should create new random boolean', () => {
		const rnd = new Random();

		expect(rnd.boolean()).toBe(true);
	});

	it('should keep state', () => {
		random.setSeed('test');

		expect(random.int(5)).toEqual(2);
		expect(random.int(10)).toEqual(3);
		expect(random.int(100)).toEqual(25);

		random.push();

		expect(random.int(5)).toEqual(2);
		expect(random.int(10)).toEqual(3);
		expect(random.int(100)).toEqual(25);

		expect(random.int(1000)).toEqual(427);

		random.pop();

		expect(random.int(1000)).toEqual(427);
	});

	it('should not keep state', () => {
		random.setSeed('test');

		expect(random.int(5)).toEqual(2);
		expect(random.int(10)).toEqual(3);
		expect(random.int(100)).toEqual(25);

		random.setSeed('test-2');
		random.push();

		expect(random.int(5)).not.toEqual(2);
		expect(random.int(10)).not.toEqual(3);
		expect(random.int(100)).not.toEqual(25);

		expect(random.int(1000)).not.toEqual(427);

		random.pop();

		random.setSeed('test');

		expect(random.int(5)).toEqual(2);
		expect(random.int(10)).toEqual(3);
		expect(random.int(100)).toEqual(25);
	});
});
