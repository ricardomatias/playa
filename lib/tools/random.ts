/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-invalid-this */
/* eslint-disable no-var, new-cap */
import Alea from 'alea';
import { NoiseFunction2D, createNoise2D } from 'simplex-noise';
import { PlayaError } from '../utils/error';

const INITIAL_SEED = 'PLAYA';
const INITIAL_X = 0;
const INITIAL_INCREMENT = 10;

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
	#x = INITIAL_X;
	#prevX = 0;
	// @ts-ignore
	#rng = new Alea(INITIAL_SEED);
	#simplex: NoiseFunction2D = createNoise2D(this.#rng);
	#seed: string | number = INITIAL_SEED;
	#prevSeed: string | number = INITIAL_SEED;
	#prevIncrement = 0;
	#state?: [number, number, number, number];
	#seedCounter = 0;

	public increment = INITIAL_INCREMENT;

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
		this.#prevSeed = this.#seed;
		this.#prevIncrement = this.increment;

		this.setSeed(this.#seed, this.increment);
	}

	/**
	 * Use in conjunction with `push()` to preserve the RNG state.
	 * @function pop
	 * @memberof Tools.Random
	 */
	pop(): void {
		this.#seed = this.#prevSeed;
		this.increment = this.#prevIncrement;
		this.#x = this.#prevX;

		if (this.#state) {
			// @ts-ignore
			this.#rng.importState(this.#state);
			// this.#simplex = createNoise2D(this.#rng);
		} else {
			throw new PlayaError('Random', 'Must use .push() before .pop()');
		}

		this.#prevX = 0;
		this.#state = undefined;
		this.#prevIncrement = 0;
		this.#prevSeed = INITIAL_SEED;
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
		this.#seed = seed;
		this.increment = increment;
		// @ts-ignore
		this.#rng = new Alea(seed);
		this.#simplex = createNoise2D(this.#rng);
	};

	/**
	 * Creates a fresh seed based
	 * @function freshSeed
	 * @memberof Tools.Random
	 *
	 * @param {Number} increment
	 */
	freshSeed = (increment: number = this.increment): void => {
		this.setSeed(Math.floor(Math.random() * 9999999).toString(), increment);
	};

	/**
	 * Resets to initial state with the defaults
	 * @function reset
	 * @memberof Tools.Random
	 */
	reset = () => {
		this.setSeed(INITIAL_SEED, INITIAL_INCREMENT);
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

		const value = (this.#simplex(this.#x, 1.0) + 1) / 2;
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
