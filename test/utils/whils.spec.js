import whilst from '../../lib/utils/whilst';

describe('A Whilst Test Suite', () => {
	it('should work as a simple for loop', () => {
		let idx = 0;

		whilst(() => {
			idx++;
		}, () => (idx < 100));

		expect(idx).to.eql(100);
	});

	it('should work as a normal while', () => {
		let idx = 0;
		let exists = true;

		whilst(() => {
			if (idx > 500) {
				exists = false;
			}

			idx++;
		}, () => (exists));

		expect(exists).to.be.false;
	});
});

