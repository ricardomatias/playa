// *****************************************************************************
// INTERVALS
// *****************************************************************************

/**
 * Semitones
 * @memberof Constants
 * @typedef {number} Semitones
 * @param {Interval} interval
 * @enum
 * @example
 * Semitones['5P'] => 7
 */
export const Semitones = <const>{
	'1P': 0,
	'2m': 1, '2M': 2,
	'3m': 3, '3M': 4,
	'4P': 5, '4A': 6,
	'5d': 6, '5P': 7, '5A': 8,
	'6m': 8, '6M': 9,
	'7m': 10, '7M': 11,
	'8P': 12,
	'9m': 13, '9M': 14,
	'11P': 17, '11A': 18,
	'13m': 20, '13M': 21,
};

export type Semitones = typeof Semitones[keyof typeof Semitones]
export type Interval = keyof typeof Semitones


