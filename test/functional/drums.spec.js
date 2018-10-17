import { seedRandom } from '../../lib/tools/random';
import drums from '../../lib/functional/drums';


describe('A Drums test suite', () => {
	it('should generate 2 parts', () => {
		seedRandom('test');

		// when
		const drum = drums(4, 2);

		// then
		expect(drum.patterns[0]).to.eql([ 'x', '-', 'x', '-' ]);
		expect(drum.patterns[1]).to.eql([ 'x', '-', '-', '-' ]);
		expect(drum.subdivision).to.eql('4n');
	});

	it('should generate 4 parts', () => {
		seedRandom('test');

		// when
		const drum = drums(8, 4);

		// then
		expect(drum.patterns[0]).to.eql([ 'x', '-', 'x', '-', 'x', '-', 'x', '-' ]);
		expect(drum.patterns[1]).to.eql([ 'x', '-', '-', 'x', '-', '-', '-', '-' ]);
		expect(drum.patterns[2]).to.eql([ 'x', '-', '-', '-', '-', '-', '-', '-' ]);
		expect(drum.patterns[3]).to.eql([ 'x', '-', '-', 'x', '-', '-', 'x', '-' ]);
		expect(drum.subdivision).to.eql('8n');
	});
});
