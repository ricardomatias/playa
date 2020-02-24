import Alea from 'alea';
import SimplexNoise from 'simplex-noise';

// The used seed for random
let globalSeed = 'PLAYA';
let simplex;
let x; let y;

let INCREMENT;

/**
 * Random Tools
 * @namespace Random
 * @memberof Tools
 */


/**
 * The seed for the RNG
 * @function getSeed
 *
 * @memberof Tools.Random
 * @return {string} seed
 */
export const getSeed = () => (globalSeed);

/**
 * Seed the Simplex Noise
 * @function seedRandom
 * @memberof Tools.Random
 *
 * @param {String|Number} seed
 * @param {Number} increment
 */
export const seedRandom = (seed = globalSeed, increment = 10.0) => {
	const alea = new Alea(seed);

	globalSeed = seed;

	INCREMENT = increment;

	simplex = new SimplexNoise(alea);

	x = Math.floor(alea() * 100);
	y = Math.floor(alea() * 100);
};

/**
 * Create a random number generator based on a seed
 * Simplex noise
 * @function random
 * @memberof Tools.Random
 *
 * @param {Number} incX
 * @param {Number} incY
 * @return {Number} [0, 1]
 */
export const random = (incX = INCREMENT, incY = INCREMENT) => {
	if (!simplex) {
		seedRandom(Math.random() * 1000);
	}

	x += incX;
	y += incY;

	return (simplex.noise2D(x, y) + 1) / 2;
};


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
export const int = (max, min = 0) => (min + Math.floor((random() * (1 + max - min))));

