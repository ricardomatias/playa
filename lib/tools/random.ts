/* eslint-disable no-invalid-this */
/* eslint-disable no-var, new-cap */
import Alea from 'alea';
import SimplexNoise from 'simplex-noise';

const INITIAL_SEED = 'PLAYA';

/**
 * It uses Simplex Noise in order for the Random numbers to follow a "more natural" progression.
 *
 * Default Export: Singleton Class
 *
 * Named Export: Class
 *
 * In the library the singleton is used for any random number generation.
 *
 * @class
 * @name Random
 * @memberof Tools
 */
export class Random {
	private static instance: Random;
	private x = 0;
	private y = 0;
	private simplex: SimplexNoise = new SimplexNoise(Alea(INITIAL_SEED));
	private _seed: string | number = INITIAL_SEED;
	private _seedCounter = 0;

	public increment = 10;

	public static getInstance(): Random {
		if (!Random.instance) {
			Random.instance = new Random();
		}

		return Random.instance;
	}

	/**
	 * Creates an instance of Random.
	 * @constructs Random
	 * @memberof Tools#
	 * @private
	 */
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	constructor() {}

	/**
	* Get the seed used by the RNG (Random Number Generator)
	*
	* @member seed
	* @memberof Tools.Random
	* @type {(string | number)}
	*/
	get seed(): string | number {
		return this._seed;
	}

	/**
	 * Seed the Simplex Noise
	 * @function setSeed
	 * @memberof Tools.Random
	 *
	 * @param {String|Number} seed
	 * @param {Number} increment
	 */
	setSeed = (seed: string, increment: number = this.increment): void => {
		const alea = Alea(seed);

		this._seed = seed;

		this.increment = increment;

		this.simplex = new SimplexNoise(alea);

		this.x = Math.floor(alea() * 100);
		this.y = Math.floor(alea() * 100);
	}

	/**
	* Takes the current seed and adds a counter
	* @function bumpSeed
	* @memberof Tools.Random
	* @example
	* seed = 'PLAYA' // default seed
	* bumpSeed() => 'PLAYA-0'
	* bumpSeed() => 'PLAYA-1'
	*
	* @param {String|Number} seed
	* @param {Number} increment
	*/
	bumpSeed(): void {
		this.setSeed(`${this._seed}`.replace(/-\d/, '') + `-${this._seedCounter++}`);
	}

	/**
	 * Generates a Random float between a range
	 *
	 * @function float
	 * @memberof Tools.Random
	 *
	 * @param {number} max
	 * @param {number} min
	 * @return {number} [0, 1]
	 */
	float = (max = 1.0, min = 0.0): number => {
		this.x += this.increment;
		this.y += this.increment;

		const value = (this.simplex.noise2D(this.x, this.y) + 1) / 2;

		return min + value * max;
	}

	/**
	 * Generates a Random integer between a range
	 *
	 * @function int
	 * @memberof Tools.Random
	 *
	 * @param {number} max
	 * @param {number} [min=0]
	 * @return {number}
	 */
	int = (max: number, min = 0): number => {
		return min + Math.floor((this.float() * (1 + max - min)));
	}

	/**
	 * Generates a Random boolean
	 *
	 * @function boolean
	 * @memberof Tools.Random
	 *
	 * @return {boolean}
	 */
	boolean = (): boolean => {
		return !!this.int(1);
	}
}

export default Random.getInstance();
