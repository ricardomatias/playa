import { seedRandom } from '../../lib/tools/random';
import createPercussion from '../../lib/functional/percussion';

describe('A Percussion test suite', () => {
	it('should generate 2 parts', () => {
		seedRandom('test');

		// when
		const perc = createPercussion(4, [ 2, 1 ]);

		// then
		expect(perc).toMatchInlineSnapshot(`
		Object {
		  "patterns": Array [
		    Array [
		      1,
		      0,
		      1,
		      0,
		    ],
		    Array [
		      1,
		      0,
		      0,
		      0,
		    ],
		  ],
		  "subdivision": "4n",
		}
	`);
	});

	it('should generate 4 parts', () => {
		seedRandom('test');

		// when
		const perc = createPercussion(8, [ 4, 2, 8, 5 ]);

		// then

		expect(perc).toMatchInlineSnapshot(`
		Object {
		  "patterns": Array [
		    Array [
		      1,
		      0,
		      1,
		      0,
		      1,
		      0,
		      1,
		      0,
		    ],
		    Array [
		      1,
		      0,
		      0,
		      0,
		      1,
		      0,
		      0,
		      0,
		    ],
		    Array [
		      1,
		      1,
		      1,
		      1,
		      1,
		      1,
		      1,
		      1,
		    ],
		    Array [
		      1,
		      0,
		      1,
		      0,
		      1,
		      1,
		      0,
		      1,
		    ],
		  ],
		  "subdivision": "8n",
		}
	`);
	});

	it('should generate 4 parts randomly', () => {
		seedRandom('test2');

		// when
		const perc = createPercussion(8, 4);
		// then
		expect(perc).toMatchInlineSnapshot(`
		Object {
		  "patterns": Array [
		    Array [
		      1,
		      0,
		      1,
		      1,
		      1,
		      0,
		      1,
		      1,
		    ],
		    Array [
		      1,
		      0,
		      0,
		      0,
		      1,
		      0,
		      0,
		      0,
		    ],
		    Array [
		      1,
		      0,
		      1,
		      0,
		      1,
		      1,
		      0,
		      1,
		    ],
		    Array [
		      1,
		      0,
		      1,
		      1,
		      1,
		      0,
		      1,
		      1,
		    ],
		  ],
		  "subdivision": "8n",
		}
	`);
	});
});
