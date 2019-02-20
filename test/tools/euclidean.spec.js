import euclidean from '../../lib/tools/euclidean';


describe('An Euclidean test suite', () => {
	describe('create', () => {
		it('should create a simple 4/4', () => {
			// when
			const pattern = euclidean.create(4, 2);

			// then
			expect(pattern).toEqual([ 'x', '-', 'x', '-' ]);
		});

		it('should create 8 -> 5, 3', () => {
			// when
			const pattern = euclidean.create(8, 3);

			// then
			expect(pattern).toEqual([
				'x', '-', '-', 'x',
				'-', '-', 'x', '-',
			]);
		});

		it('should create 7', () => {
			// when
			const pattern = euclidean.create(7, 2);

			// then
			expect(pattern).toEqual([
				'x', '-', '-', '-', 'x', '-', '-',
			]);
		});

		it('should create 9 -> 5, 4', () => {
			// when
			const pattern = euclidean.create(9, 4);

			// then
			expect(pattern).toEqual([
				'x', '-', '-', 'x', '-', 'x', '-', 'x', '-',
			]);
		});

		it('should create 7 -> 4, 3', () => {
			// when
			const pattern = euclidean.create(7, 3);

			// then
			expect(pattern).toEqual([
				'x', '-', '-', 'x', '-', 'x', '-',
			]);
		});

		it('should create 16 : 6', () => {
			// when
			const pattern = euclidean.create(16, 6);

			expect(pattern).toEqual([
				'x', '-', '-', 'x', '-', '-', 'x', '-',
				'x', '-', '-', 'x', '-', '-', 'x', '-',
			]);
		});

		it('should create 16 : 4', () => {
			// when
			const pattern = euclidean.create(16, 4);

			// then
			expect(pattern).toEqual([
				'x', '-', '-', '-', 'x', '-', '-', '-',
				'x', '-', '-', '-', 'x', '-', '-', '-',
			]);
		});
	});

	describe('rotate', () => {
		it('should rotate a simple 4/4', () => {
			// when
			const pattern = euclidean.rotate([ 'x', '-', 'x', '-' ]);

			// then
			expect(pattern).toEqual([ 'x', '-', 'x', '-' ]);
		});

		it('should rotate 8 -> 5, 3', () => {
			// when
			const pattern = euclidean.rotate([
				'x', '-', '-', 'x',
				'-', '-', 'x', '-',
			]);

			// then
			expect(pattern).toEqual([
				'x', '-', 'x', '-',
				'-', 'x', '-', '-',
			]);
		});

		it('should create 7 -> 4, 3', () => {
			// when
			const pattern = euclidean.rotate([
				'x', '-', '-', 'x', '-', 'x', '-',
			]);

			// then
			expect(pattern).toEqual([
				'x', '-', 'x', '-', '-', 'x', '-',
			]);
		});
	});
});
