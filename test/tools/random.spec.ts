import random, { Random } from '../../lib/tools/random';
import { mapRepeat } from '../../lib/tools/map-repeat';

describe('A Random test suite', () => {
	beforeEach(() => random.reset());

	it('should return singleton', () => {
		const result = mapRepeat(10, () => {
			random.setSeed('test');

			return random.int(10);
		}).every((v) => !!v);

		expect(result).toBeTruthy();
	});

	it('should create new random int', () => {
		random.setSeed('test');

		const results = mapRepeat(10, () => random.int(20, 10));

		expect(results.filter((n) => n >= 10 && n <= 20)).toHaveLength(10);
		expect(results).toMatchInlineSnapshot(`
		[
		  15,
		  10,
		  12,
		  15,
		  17,
		  15,
		  15,
		  17,
		  15,
		  15,
		]
	`);
	});

	it('should create new random int small increment', () => {
		random.setSeed('test', 0.1);

		const results = mapRepeat(10, () => random.int(20, 10));

		expect(results.filter((n) => n >= 10 && n <= 20)).toHaveLength(10);
		expect(results).toMatchInlineSnapshot(`
		[
		  10,
		  11,
		  11,
		  12,
		  12,
		  13,
		  14,
		  15,
		  16,
		  17,
		]
	`);
	});

	it('should create new random int large increment', () => {
		random.setSeed('test', 100);

		const results = mapRepeat(10, () => random.int(20, 10));

		expect(results.filter((n) => n >= 10 && n <= 20)).toHaveLength(10);
		expect(results).toMatchInlineSnapshot(`
		[
		  15,
		  17,
		  13,
		  17,
		  18,
		  15,
		  14,
		  19,
		  13,
		  16,
		]
	`);
	});

	it('should create new random float', () => {
		random.setSeed('test', 10);

		const results = mapRepeat(10, () => random.float(10, 5));

		expect(results.filter((n) => n >= 5 && n <= 10)).toHaveLength(10);
		expect(results.map((n) => n.toFixed(3))).toMatchInlineSnapshot(`
		[
		  "7.335",
		  "5.325",
		  "6.269",
		  "7.544",
		  "8.494",
		  "7.606",
		  "7.654",
		  "8.273",
		  "7.425",
		  "7.697",
		]
	`);
	});

	it('should create new random boolean', () => {
		const rnd = new Random();

		expect(rnd.boolean()).toBe(true);
	});

	it('should return a fresh seed', () => {
		const rnd = new Random();
		rnd.setSeed('test');

		rnd.freshSeed();

		expect(rnd.seed).not.toBe('test');
	});

	it('should keep state', () => {
		random.setSeed('test');

		expect(random.int(5)).toEqual(2);
		expect(random.int(10)).toEqual(0);
		expect(random.int(100)).toEqual(25);

		random.push();

		expect(random.int(5)).toEqual(2);
		expect(random.int(10)).toEqual(0);
		expect(random.int(100)).toEqual(25);

		expect(random.int(10000)).toEqual(5089);
		expect(random.int(10000)).toEqual(6989);

		random.pop();

		expect(random.int(10000)).toEqual(5089);
		expect(random.int(10000)).toEqual(6989);
	});

	it('should not keep state', () => {
		random.setSeed('test');

		expect(random.int(9999)).toEqual(4669);
		expect(random.int(9999)).toEqual(650);
		expect(random.int(9999)).toEqual(2538);

		random.push();
		random.setSeed('test22222');

		expect(random.int(9999)).toEqual(5330);
		expect(random.int(9999)).toEqual(4669);
		expect(random.int(9999)).toEqual(5569);

		random.pop();

		expect(random.int(9999)).toEqual(5000);
		expect(random.int(9999)).toEqual(2551);
		expect(random.int(9999)).toEqual(2557);
	});
});
