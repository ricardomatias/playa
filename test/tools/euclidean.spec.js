import euclidean from '../../lib/tools/euclidean';


describe('An Euclidean test suite', () => {
	describe('create', () => {
		it('should create a simple 4/4', () => {
			// when
			const pattern = euclidean.create(2, 2);

			// then
			expect(pattern).to.eql([ 'x', '-', 'x', '-' ]);
		});

		it('should create 8 -> 5, 3', () => {
			// when
			const pattern = euclidean.create(5, 3);

			// then
			expect(pattern).to.eql([
				'x', '-', '-', 'x',
				'-', '-', 'x', '-',
			]);
		});

		it('should create 7', () => {
			// when
			const pattern = euclidean.create(5, 2);

			// then
			expect(pattern).to.eql([
				'x', '-', '-', 'x', '-', '-', '-',
			]);
		});

		it('should create 9 -> 5, 4', () => {
			// when
			const pattern = euclidean.create(5, 4);

			// then
			expect(pattern).to.eql([
				'x', '-', '-', 'x', '-', 'x', '-', 'x', '-',
			]);
		});

		it('should create 7 -> 4, 3', () => {
			// when
			const pattern = euclidean.create(4, 3);

			// then
			expect(pattern).to.eql([
				'x', '-', '-', 'x', '-', 'x', '-',
			]);
		});

		it('should create 16', () => {
			// when
			const pattern = euclidean.create(10, 6);

			// then
			expect(pattern).to.eql([
				'x', '-', '-', 'x', '-', 'x', '-', '-',
				'x', '-', '-', 'x', '-', 'x', '-', '-',
			]);
		});
	});

	describe('rotate', () => {
		it('should rotate a simple 4/4', () => {
			// when
			const pattern = euclidean.rotate([ 'x', '-', 'x', '-' ]);

			// then
			expect(pattern).to.eql([ 'x', '-', 'x', '-' ]);
		});

		it('should rotate 8 -> 5, 3', () => {
			// when
			const pattern = euclidean.rotate([
				'x', '-', '-', 'x',
				'-', '-', 'x', '-',
			]);

			// then
			expect(pattern).to.eql([
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
			expect(pattern).to.eql([
				'x', '-', 'x', '-', '-', 'x', '-',
			]);
		});
	});
});
