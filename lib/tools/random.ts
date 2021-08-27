/* eslint-disable no-invalid-this */
/* eslint-disable no-var, new-cap */
import Alea from 'alea';
import SimplexNoise from 'simplex-noise';
import { PlayaError } from '../utils';

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
	#x = 0;
	#y = 0;
	#prevX = 0;
	#prevY = 0;
	#rng = Alea(INITIAL_SEED);
	#simplex: SimplexNoise = new SimplexNoise(this.#rng);
	#seed: string | number = INITIAL_SEED;
	#state?: [number, number, number, number];
	#seedCounter = 0;

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
		return this.#seed;
	}

	/**
	 * Use in conjunction with `pop()` to preserve the RNG state
	 * The point of this is to isolate the calls within push/pop so that they aren't affected
	 * by the occurrence of previous `random` calls.
	 *
	 * @example
	 * random.push();
	 * const a = random.float();
	 * random.pop();
	 * const b = random.float();
	 *
	 * a === b
	 * @function push
	 * @memberof Tools.Random
	 */
	push(): void {
		this.#state = this.#rng.exportState();
		this.#prevX = this.#x;
		this.#prevY = this.#y;

		this.setSeed(this.seed, this.increment);
	}

	/**
	 * Use in conjunction with `push()` to preserve the RNG state.
	 * @function pop
	 * @memberof Tools.Random
	 */
	pop(): void {
		this.#x = this.#prevX;
		this.#y = this.#prevY;
		this.#prevX = 0;
		this.#prevY = 0;

		if (this.#state) {
			this.#rng.importState(this.#state);
		} else {
			throw new PlayaError('Random', 'Must use .push() before .pop()');
		}
	}

	/**
	 * Seed the Simplex Noise
	 * @function setSeed
	 * @memberof Tools.Random
	 *
	 * @param {String|Number} seed
	 * @param {Number} increment
	 */
	setSeed = (seed: string | number, increment: number = this.increment): void => {
		this.#x = 0;
		this.#y = 999;
		this.#seed = seed;
		this.increment = increment;

		this.#rng = Alea(seed);
	};

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
		this.setSeed(`${this.#seed}`.replace(/-\d/, '') + `-${this.#seedCounter++}`);
	}

	/**
	 * Generates a Random float between a range
	 *
	 * @function float
	 * @memberof Tools.Random
	 *
	 * @param {number} max
	 * @param {number} min
	 * @return {number} [0, 1[
	 */
	float = (max = 1.0, min = 0.0): number => {
		this.#x += this.increment;
		this.#y += this.increment;

		const value = (this.#simplex.noise2D(this.#x, this.#y) + 1) / 2;
		const result = min + value * (max - min);

		return result;
	};

	/**
	 * Generates a Random integer between a range [inclusive, inclusive]
	 *
	 * @function int
	 * @memberof Tools.Random
	 *
	 * @param {number} max
	 * @param {number} [min=0]
	 * @return {number}
	 */
	int = (max: number, min = 0): number => {
		return min + Math.floor(this.float() * (1 + max - min));
	};

	/**
	 * Generates a Random boolean
	 *
	 * @function boolean
	 * @memberof Tools.Random
	 *
	 * @return {boolean}
	 */
	boolean = (): boolean => {
		return Boolean(this.int(1));
	};
}

export default Random.getInstance();
