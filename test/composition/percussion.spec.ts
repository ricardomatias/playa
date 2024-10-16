import { describe, it, expect } from 'vitest';
import random from '../../lib/tools/random';
import { createPercussion } from '../../lib/composition/percussion';

describe('A Percussion test suite', () => {
	it('should generate 2 parts', () => {
		random.setSeed('test');

		// when
		const perc = createPercussion(4, [2, 1]);

		// then
		expect(perc).toMatchInlineSnapshot(`
		{
		  "patterns": [
		    [
		      1,
		      0,
		      1,
		      0,
		    ],
		    [
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
		random.setSeed('test');

		// when
		const perc = createPercussion(8, [4, 2, 8, 5]);

		// then

		expect(perc).toMatchInlineSnapshot(`
		{
		  "patterns": [
		    [
		      1,
		      0,
		      1,
		      0,
		      1,
		      0,
		      1,
		      0,
		    ],
		    [
		      1,
		      0,
		      0,
		      0,
		      1,
		      0,
		      0,
		      0,
		    ],
		    [
		      1,
		      1,
		      1,
		      1,
		      1,
		      1,
		      1,
		      1,
		    ],
		    [
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
		random.setSeed('test2');

		// when
		const perc = createPercussion(8, 4);
		// then
		expect(perc).toMatchInlineSnapshot(`
		{
		  "patterns": [
		    [
		      1,
		      0,
		      1,
		      0,
		      1,
		      0,
		      1,
		      0,
		    ],
		    [
		      1,
		      0,
		      1,
		      1,
		      1,
		      0,
		      1,
		      1,
		    ],
		    [
		      1,
		      0,
		      0,
		      1,
		      0,
		      0,
		      1,
		      0,
		    ],
		    [
		      1,
		      0,
		      1,
		      0,
		      1,
		      0,
		      1,
		      0,
		    ],
		  ],
		  "subdivision": "8n",
		}
	`);
	});

	it('should rotate 2 parts', () => {
		random.setSeed('test');

		// when
		let perc = createPercussion(8, [5, 3]);

		expect(perc).toMatchInlineSnapshot(`
		{
		  "patterns": [
		    [
		      1,
		      0,
		      1,
		      0,
		      1,
		      1,
		      0,
		      1,
		    ],
		    [
		      1,
		      0,
		      0,
		      1,
		      0,
		      0,
		      1,
		      0,
		    ],
		  ],
		  "subdivision": "8n",
		}
	`);

		perc = createPercussion(8, [5, 3], [1, 2]);

		// then
		expect(perc).toMatchInlineSnapshot(`
		{
		  "patterns": [
		    [
		      1,
		      1,
		      0,
		      1,
		      0,
		      1,
		      1,
		      0,
		    ],
		    [
		      1,
		      0,
		      0,
		      1,
		      0,
		      1,
		      0,
		      0,
		    ],
		  ],
		  "subdivision": "8n",
		}
	`);
	});

	it('should shift', () => {
		random.setSeed('test');

		// when
		const perc = createPercussion(4, [2, 1], [], [0, 2]);

		// then
		expect(perc).toMatchInlineSnapshot(`
		{
		  "patterns": [
		    [
		      1,
		      0,
		      1,
		      0,
		    ],
		    [
		      0,
		      0,
		      1,
		      0,
		    ],
		  ],
		  "subdivision": "4n",
		}
	`);
	});
});
