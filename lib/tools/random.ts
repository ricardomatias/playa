/* eslint-disable no-var, new-cap */
import Alea from 'alea';
import SimplexNoise from 'simplex-noise';

const INITIAL_SEED = 'PLAYA';

/**
 * Random Tools
 * @class
 * @static
 * @name Random
 * @namespace Random
 * @memberof Tools
 */
class Random {
	private static instance: Random;
	private x = 0;
	private y = 0;
	private simplex: SimplexNoise = new SimplexNoise(Alea(INITIAL_SEED));
	private _seed: string | number = INITIAL_SEED;

	public increment = 10;

	// eslint-disable-next-line @typescript-eslint/no-empty-function
	private constructor() {	}

	public static getInstance(): Random {
		if (!Random.instance) {
			Random.instance = new Random();
		}

		return Random.instance;
	}

	/**
	* Random's seed
	* @member seed
	* @memberof Tools.Random
	* @type {(string | number)}
	*/
	get seed(): string | number {
		return this._seed;
	}

	/**
	 * Seed the Simplex Noise
	 * @function seedRandom
	 * @memberof Tools.Random
	 *
	 * @param {String|Number} seed
	 * @param {Number} increment
	 */
	setSeed(seed: string, increment = this.increment): void {
		const alea = Alea(seed);

		this._seed = seed;

		this.increment = increment;

		this.simplex = new SimplexNoise(alea);

		this.x = Math.floor(alea() * 100);
		this.y = Math.floor(alea() * 100);
	}

	/**
	 * Create a random number generator based on a seed
	 * Simplex noise
	 * @function float
	 * @memberof Tools.Random
	 *
	 * @param {Number} max
	 * @param {Number} min
	 * @return {Number} [0, 1]
	 */
	float = (max = 1, min = 0): number => {
		this.x += this.increment;
		this.y += this.increment;

		const value = (this.simplex.noise2D(this.x, this.y) + 1) / 2;

		return min + value * max;
	}

	/**
	 * Generates a random integer between a range
	 *
	 * @function randomInt
	 * @memberof Tools.Random
	 *
	 * @param {Number} max
	 * @param {Number} [min=0]
	 * @return {Number}
	 */
	int(max: number, min = 0): number {
		return min + Math.floor((this.float() * (1 + max - min)));
	}
}

export default Random.getInstance();
