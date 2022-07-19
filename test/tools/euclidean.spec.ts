import * as Euclidean from '../../lib/tools/euclidean';

describe('An Euclidean test suite', () => {
	describe('create', () => {
		it('should create a simple 4/4', () => {
			// when
			const pattern = Euclidean.create(4, 2);

			// then
			expect(pattern).toEqual([1, 0, 1, 0]);
		});

		it('should create 8 -> 5, 3', () => {
			// when
			const pattern = Euclidean.create(8, 3);

			// then
			expect(pattern).toEqual([1, 0, 0, 1, 0, 0, 1, 0]);
		});

		it('should create 7', () => {
			// when
			const pattern = Euclidean.create(7, 2);

			// then
			expect(pattern).toEqual([1, 0, 0, 0, 1, 0, 0]);
		});

		it('should create 9 -> 5, 4', () => {
			// when
			const pattern = Euclidean.create(9, 4);

			// then
			expect(pattern).toEqual([1, 0, 0, 1, 0, 1, 0, 1, 0]);
		});

		it('should create 7 -> 4, 3', () => {
			// when
			const pattern = Euclidean.create(7, 3);

			// then
			expect(pattern).toEqual([1, 0, 0, 1, 0, 1, 0]);
		});

		it('should create 16 : 6', () => {
			// when
			const pattern = Euclidean.create(16, 6);

			expect(pattern).toEqual([1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0]);
		});

		it('should create 16 : 4', () => {
			// when
			const pattern = Euclidean.create(16, 4);

			// then
			expect(pattern).toEqual([1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]);
		});
	});

	describe('rotate', () => {
		it('should rotate a simple 4/4', () => {
			// when
			const pattern = Euclidean.rotate([1, 0, 1, 0]);

			// then
			expect(pattern).toEqual([1, 0, 1, 0]);
		});

		it('should rotate 8 -> 5, 3', () => {
			// when
			const pattern = Euclidean.rotate([1, 0, 0, 1, 0, 0, 1, 0]);

			// then
			expect(pattern).toEqual([1, 0, 1, 0, 0, 1, 0, 0]);
		});

		it('should create 7 -> 4, 3', () => {
			// when
			const pattern = Euclidean.rotate([1, 0, 0, 1, 0, 1, 0]);

			// then
			expect(pattern).toEqual([1, 0, 1, 0, 0, 1, 0]);
		});
	});
});
