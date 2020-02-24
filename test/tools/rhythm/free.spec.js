import { TICKS } from '../../../lib/constants';
import { Random, Rhythm, distribute } from '../../../lib/tools';

const { seedRandom } = Random;
const { free: generateFreeRhythm } = Rhythm;

import { calcRythmDuration } from '../../helpers';

const ONE_BAR = TICKS.get('1n');

const { mixed, slow, robotic, straight } = Rhythm.presets;

describe('#generateFreeRhythm', () => {
	it('should generate rhythm - decreasing', () => {
		// given
		seedRandom('test');

		// when
		const rhythm = generateFreeRhythm(
			ONE_BAR,
			mixed,
			distribute.decreasing,
		);

		// then
		expect(calcRythmDuration(rhythm)).toBe(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  "4n",
		  "8nt",
		  "8n",
		  "16n",
		  "4nt",
		  "8n",
		  "8nd",
		]
	`);
	});
	it('should generate rhythm - slow', () => {
		// given
		seedRandom('test');

		// when
		const rhythm = generateFreeRhythm(ONE_BAR, slow, distribute.equal);

		// then
		expect(calcRythmDuration(rhythm)).toBe(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  "4nd",
		  "4n",
		  "4nd",
		]
	`);
	});

	it('should generate rhythm - robotic', () => {
		// given
		seedRandom('test');

		// when
		const rhythm = generateFreeRhythm(ONE_BAR, robotic, distribute.equal);

		// then
		expect(calcRythmDuration(rhythm)).toBe(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  "8n",
		  "32n",
		  "16n",
		  "32n",
		  "16n",
		  "16n",
		  "32n",
		  "32n",
		  "16n",
		  "32n",
		  "32n",
		  "32n",
		  "16n",
		  "16n",
		  "8n",
		  "16n",
		  "16n",
		  "32n",
		]
	`);
	});

	it('should generate rhythm - straight', () => {
		// given
		seedRandom('test');

		// when
		const rhythm = generateFreeRhythm(ONE_BAR, straight, distribute.equal);

		// then
		expect(calcRythmDuration(rhythm)).toBe(ONE_BAR);
		expect(rhythm).toMatchInlineSnapshot(`
		Array [
		  "4n",
		  "16n",
		  "4n",
		  "16n",
		  "8n",
		  "4n",
		]
	`);
	});

	it('should break', () => {
		// given
		seedRandom('test');

		// when
		const error = () =>
			generateFreeRhythm(ONE_BAR / 8, slow, distribute.equal);

		// then
		expect(error).toThrowError();
	});
});
