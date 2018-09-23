import { ring } from '../lib/tools';

const AM7 = ['A', 'C', 'E', 'G'];

describe('A Tools test suite', () => {
	it('should create a ring', () => {
		const am7 = ring(AM7);

		expect(am7[0]).to.eql('A');
		expect(am7[4]).to.eql('A');
		expect(am7[-4]).to.eql('A');

		expect(am7[3]).to.eql('G');
		expect(am7[-1]).to.eql('G');
		expect(am7[7]).to.eql('G');
	});

	it('should return a new ring', () => {
		const am7 = ring(AM7);
		const am7b = ring(AM7);

		expect(am7).to.not.equal(am7b);
	});
});
