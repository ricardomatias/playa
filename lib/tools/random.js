import Alea from 'alea';
import SimplexNoise from 'simplex-noise';

// The used seed for random
let simplex;
let x; let y;

let INCREMENT;

/**
 * Seed the Simplex Noise
 *
 * @param {String|Number} seed
 * @param {Number} increment
 */
export const seedRandom = (seed, increment) => {
	const alea = new Alea(seed);

	INCREMENT = increment || 10;

	simplex = new SimplexNoise(alea);

	x = Math.floor(alea() * 100);
	y = Math.floor(alea() * 100);
};

/**
 * Create a random number generator based on a seed
 * Simplex noise
 *
 * @param {String|Number} s
 * @return {Number}
 */
export const random = () => {
	if (!simplex) {
		seedRandom(Math.random() * 1000);
	}

	const float = (simplex.noise2D(x, y) + 1) / 2;

	x += INCREMENT;
	y += INCREMENT;

	return float;
};


/**
 * Generates a random integer between a range
 *
 * @param {Number} max
 * @param {Number} [min=0]
 * @return {Number}
 */
export const randomInt = (max, min = 0) => (min + Math.floor((random() * (max - min))));

