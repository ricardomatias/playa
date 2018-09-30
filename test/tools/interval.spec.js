import { interval } from '../../lib/tools';

const { add, subtract, semitones, invert } = interval;


describe('A Distance test suite', () => {
	describe('#get', () => {
		it('should return interval when given semitones', () => {
			const result = interval(4);

			expect(result).to.eql([ '3M' ]);
		});

		it('should return null', () => {
			const result = interval(100);

			expect(result).to.be.null;
		});
	});

	describe('#semitones', () => {
		it('should return semitones of an interval', () => {
			const result = semitones('3M');

			expect(result).to.equal(4);
		});

		it('should return null', () => {
			const result = semitones('16M');

			expect(result).to.be.null;
		});
	});

	describe('#invert', () => {
		it('should invert 3m -> 6M', () => {
			const result = invert('3m');

			expect(result).to.eql([ '6M' ]);
		});

		it('should invert 7m -> 6M', () => {
			const result = invert('7m');

			expect(result).to.eql([ '2M' ]);
		});

		it('should invert 3m -> 6M', () => {
			const result = invert('9m');

			expect(result).to.be.null;
		});
	});

	describe('#add', () => {
		it('should add 3M + 3M', () => {
			const result = add('3M', '3M');

			expect(result).to.eql([ '5A', '6m' ]);
		});

		it('should add 7m + 3M', () => {
			const result = add('7m', '3M');

			expect(result).to.eql([ '9M' ]);
		});

		it('should be null', () => {
			const result = add('13M', '3M');

			expect(result).to.be.null;
		});
	});

	describe('#subtract', () => {
		it('should add 9m - 3m', () => {
			const result = subtract('9m', '3m');

			expect(result).to.eql([ '7m' ]);
		});

		it('should be null', () => {
			const result = subtract('2m', '3m');

			expect(result).to.be.null;
		});
	});
});
