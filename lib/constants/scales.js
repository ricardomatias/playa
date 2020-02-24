// *****************************************************************************
// SCALES
// *****************************************************************************
/**
 * Scales
 * @memberof Constants
 * @namespace Constants.Scales
 */

/**
 * Chromatic scale
 * @type {string}
 * @memberof Constants.Scales
 * @default
 * @readonly
 */
const CHROMATIC_SCALE = '1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M';

/**
 * Lydian Mode - IV
 * @type {string}
 * @memberof Constants.Scales
 * @default
 * @readonly
*/
const LYDIAN = '1P 2M 3M 4A 5P 6M 7M';

/**
* Major
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const MAJOR = '1P 2M 3M 4P 5P 6M 7M';

/**
* Ionian Mode - I
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const IONIAN = '1P 2M 3M 4P 5P 6M 7M';

/**
* Mixolydian Mode - V
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const MIXOLYDIAN = '1P 2M 3M 4P 5P 6M 7m';

/**
* Minor
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const MINOR = '1P 2M 3m 4P 5P 6m 7m';

/**
* Aeolian Mode - VI
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const AEOLIAN = '1P 2M 3m 4P 5P 6m 7m';

/**
* Dorian Mode - II
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const DORIAN = '1P 2M 3m 4P 5P 6M 7m';

/**
* Phrygian Mode - III
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const PHRYGIAN = '1P 2m 3m 4P 5P 6m 7m';

/**
* Phrygian Mode - VII
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const LOCRIAN = '1P 2m 3m 4P 5d 6m 7m';

/**
* Major Pentatonic
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const MAJOR_PENTATONIC = '1P 2M 3M 5P 6M';

/**
* Minor Pentatonic
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const MINOR_PENTATONIC = '1P 3m 4P 5P 7m';

/**
* Egyptian
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const EGYPTIAN = '1P 2M 4P 5P 7m';

/**
* Melodic Minor
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const MELODIC_MINOR = '1P 2M 3m 4P 5P 6M 7M';

/**
* Altered - Diminished 5th and minor 6
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const ALTERED = '1P 2m 3m 3M 5d 6m 7m';

/**
* Harmonic Minor
* @type {string}
* @memberof Constants.Scales
* @default
* @readonly
*/
const HARMONIC_MINOR = '1P 2M 3m 4P 5P 6m 7M';

const SCALES = new Map([
	[ 'LYDIAN', LYDIAN ],
	[ 'MAJOR', MAJOR ],
	[ 'IONIAN', IONIAN ],
	[ 'MIXOLYDIAN', MIXOLYDIAN ],
	[ 'MINOR', MINOR ],
	[ 'AEOLIAN', AEOLIAN ],
	[ 'DORIAN', DORIAN ],
	[ 'PHRYGIAN', PHRYGIAN ],
	[ 'LOCRIAN', LOCRIAN ],
	[ 'MAJOR_PENTATONIC', MAJOR_PENTATONIC ],
	[ 'MINOR_PENTATONIC', MINOR_PENTATONIC ],
	[ 'EGYPTIAN', EGYPTIAN ],
	[ 'MELODIC_MINOR', MELODIC_MINOR ],
	[ 'ALTERED', ALTERED ],
	[ 'HARMONIC_MINOR', HARMONIC_MINOR ],
]);

export { CHROMATIC_SCALE, SCALES };
