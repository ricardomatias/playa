/* eslint max-len: 0 */
// *****************************************************************************
// CHORDS
// *****************************************************************************

/**
 * Chord Names
 * @memberof Constants
 * @typedef {string} ChordName
 * @enum
 * @example
 * ChordName.Major => 'Major'
 */
export const ChordName = <const>{
	/**
	* Major triad
	* @type {string}
	* @memberof Constants.ChordName
	* @default
	* @readonly
	*/
	Major: 'Major',
	/**
	 * Minor triad
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Minor: 'Minor',
	/**
	 * Augmented 5th triad
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Aug: 'Aug',
	/**
	 * Diminished 5th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Dim: 'Dim',
	/**
	 * Suspended 2nd triad
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Sus2: 'Sus2',
	/**
	 * Suspended 4th triad
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Sus4: 'Sus4',
	/**
	 * Power triad
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	P5: 'P5',
	/**
	 * Major 6th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorSix: 'MajorSix',
	/**
	 * Minor 6th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorSix: 'MinorSix',
	/**
	 * Minor triad, major 6th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorMajorSix: 'MinorMajorSix',
	/**
	 * Minor 6th added 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorSixAddNine: 'MinorSixAddNine',
	/**
	 * Major 6th added 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorSixAddNine: 'MajorSixAddNine',
	/**
	 * Dominant 7th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Seven: 'Seven',
	/**
	 * Minor 7th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorSeven: 'MinorSeven',
	/**
	 * Minor 7th flat 5 chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorSevenFlatFive: 'MinorSevenFlatFive',
	/**
	 * Major 7th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorSeven: 'MajorSeven',
	/**
	 * 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Nine: 'Nine',
	/**
	 * Minor 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorNine: 'MinorNine',
	/**
	 * Major 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorNine: 'MajorNine',
	/**
	 * 11th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Eleven: 'Eleven',
	/**
	 * Minor 11th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorEleven: 'MinorEleven',
	/**
	 * Major 11th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorEleven: 'MajorEleven',
	/**
	 * 13th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Thirteen: 'Thirteen',
	/**
	 * Minor 13th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorThirteen: 'MinorThirteen',
	/**
	 * Major 13th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorThirteen: 'MajorThirteen',
};

/**
 * Chord Name
 *
 * @typedef {string} ChordName
 * @memberof Types
 */

export type ChordName = typeof ChordName[keyof typeof ChordName];

/**
 * Chord Symbols
 * @memberof Constants
 * @typedef {string} ChordSymbol
 * @param {ChordName}
 * @enum
 * @example
 * ChordSymbol.Major => 'maj'
 */
export const ChordSymbol = {
	/**
	* Major triad
	* @type {ChordSymbol}
	* @memberof Constants.ChordSymbol
	* @default
	* @readonly
	*/
	Major: 'maj',
	/**
	 * Minor triad
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Minor: 'm',
	/**
	 * Augmented 5th triad
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Aug: 'aug',
	/**
	 * Diminished 5th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Dim: 'dim',
	/**
	 * Suspended 2nd triad
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Sus2: 'sus2',
	/**
	 * Suspended 4th triad
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Sus4: 'sus4',
	/**
	 * Power triad
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	P5: '5',
	/**
	 * Major 6th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorSix: '6',
	/**
	 * Minor 6th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorSix: 'm6m',
	/**
	 * Minor triad, major 6th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorMajorSix: 'm6',
	/**
	 * Minor 6th added 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorSixAddNine: 'm6add9',
	/**
	 * Major 6th added 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorSixAddNine: '6add9',
	/**
	 * Dominant 7th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Seven: '7',
	/**
	 * Minor 7th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorSeven: 'm7',
	/**
	 * Minor 7th flat 5 chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorSevenFlatFive: 'm7b5',
	/**
	 * Major 7th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorSeven: 'M7',
	/**
	 * 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Nine: '9',
	/**
	 * Minor 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorNine: 'm9',
	/**
	 * Major 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorNine: 'M9',
	/**
	 * 11th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Eleven: '11',
	/**
	 * Minor 11th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorEleven: 'm11',
	/**
	 * Major 11th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorEleven: 'M11',
	/**
	 * 13th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Thirteen: '13',
	/**
	 * Minor 13th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorThirteen: 'm13',
	/**
	 * Major 13th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorThirteen: 'M13',
} as const;

export type ChordSymbol = typeof ChordSymbol[ChordName];

/**
* Chord Intervals
*
* @typedef {string} ChordIntervals
* @param {ChordName}
* @memberof Constants
* @enum
*/
export const ChordIntervals = <const>{
	/**
	* Major triad
	* @type {string}
	* @memberof Constants.ChordIntervals
	* @default
	* @readonly
	*/
	'Major': '1P 3M 5P',
	/**
	 * Minor triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'Minor': '1P 3m 5P',
	/**
	 * Augmented 5th triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'Aug': '1P 3M 5A',
	/**
	 * Diminished 5th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'Dim': '1P 3m 5d',
	/**
	 * Suspended 2nd triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'Sus2': '1P 2M 5P',
	/**
	 * Suspended 4th triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'Sus4': '1P 4P 5P',
	/**
	 * Power triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'P5': '1P 5P 8P',
	/**
	 * Major 6th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MajorSix': '1P 3M 5P 6M',
	/**
	 * Minor 6th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MinorSix': '1P 3m 5P 6m',
	/**
	 * Minor triad, major 6th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MinorMajorSix': '1P 3m 5P 6M',
	/**
	 * Minor 6th added 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MinorSixAddNine': '1P 3M 5P 6m 9M',
	/**
	 * Major 6th added 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MajorSixAddNine': '1P 3M 5P 6M 9M',
	/**
	 * Dominant 7th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'Seven': '1P 3M 5P 7m',
	/**
	 * Minor 7th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MinorSeven': '1P 3m 5P 7m',
	/**
	 * Minor 7th flat 5 chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MinorSevenFlatFive': '1P 3m 5d 7m',
	/**
	 * Major 7th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MajorSeven': '1P 3M 5P 7M',
	/**
	 * 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'Nine': '1P 3M 5P 7m 9M',
	/**
	 * Minor 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MinorNine': '1P 3m 5P 7m 9M',
	/**
	 * Major 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MajorNine': '1P 3M 5P 7M 9M',
	/**
	 * 11th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'Eleven': '1P 3M 5P 7m 9M 11P',
	/**
	 * Minor 11th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MinorEleven': '1P 3m 5P 7m 9M 11P',
	/**
	 * Major 11th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MajorEleven': '1P 3M 5P 7M 9M 11P',
	/**
	 * 13th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'Thirteen': '1P 3M 5P 7m 9M 13M',
	/**
	 * Minor 13th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MinorThirteen': '1P 3m 5P 7m 9M 13M',
	/**
	 * Major 13th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	'MajorThirteen': '1P 3M 5P 7M 9M 13M',
};

export type ChordIntervals = typeof ChordIntervals[ChordName];

/**
 * Chord Structure definition
 * @typedef ChordStructure
 * @memberof Types
 * @type {array}
 * @property {number} 0 - number of intervals
 * @property {Array<string>} 1 - intervals position
 */

/**
 * Chord Structure
 *
 * @type {ChordStructure}
 * @memberof Constants
 * @enum
 * @example
 * ChordStructure.Triad => [ 3, [ '1 3 5' ] ]
 */
export const ChordStructure = <const>{
	/**
	 * Triads chords structure
	 * @type {ChordStructure}
	 * @memberof Constants.ChordStructure
	 * @default
	 * @readonly
	 * @constant
	 */
	Triad: [ 3, [ '1 3 5' ] ],
	/**
	* Suspended chords structure
	* @type {ChordStructure}
	* @memberof Constants.ChordStructure
	* @default
	* @readonly
	* @constant
	*/
	Sus: [ 3, [ '1 2 5', '1 4 5' ] ],
	/**
	* Sixth chords structure
	* @type {ChordStructure}
	* @memberof Constants.ChordStructure
	* @default
	* @readonly
	* @constant
	*/
	Sixth: [ 4, [ '1 3 5 6' ] ],
	/**
	* Seventh chords structure
	* @type {ChordStructure}
	* @memberof Constants.ChordStructure
	* @default
	* @readonly
	* @constant
	*/
	Seventh: [ 4, [ '1 3 5 7' ] ],
	/**
	* Ninth chords structure
	* @type {ChordStructure}
	* @memberof Constants.ChordStructure
	* @default
	* @readonly
	* @constant
	*/
	Ninth: [ 5, [ '1 3 5 7 9' ] ],
	/**
	* Eleventh chords structure
	* @type {ChordStructure}
	* @memberof Constants.ChordStructure
	* @default
	* @readonly
	* @constant
	*/
	Eleventh: [ 6, [ '1 3 5 7 9 11' ] ],
	/**
	* Thirteenth chords structure
	* @type {ChordStructure}
	* @memberof Constants.ChordStructure
	* @default
	* @readonly
	* @constant
	*/
	Thirteenth: [ 6, [ '1 3 5 7 9 13' ] ],
};

export type ChordStructure = typeof ChordStructure[keyof typeof ChordStructure];


const toDefObj = (name: ChordName, symbol: ChordSymbol, intervals: ChordIntervals, structure: ChordStructure) => ({ name, symbol, intervals, structure });

export const ChordDefinition = <const>{
	[ChordName.Major]: toDefObj(ChordName.Major, ChordSymbol.Major, ChordIntervals.Major, ChordStructure.Triad),
	[ChordName.Minor]: toDefObj(ChordName.Minor, ChordSymbol.Minor, ChordIntervals.Minor, ChordStructure.Triad),
	[ChordName.Aug]: toDefObj(ChordName.Aug, ChordSymbol.Aug, ChordIntervals.Aug, ChordStructure.Triad),
	[ChordName.Dim]: toDefObj(ChordName.Dim, ChordSymbol.Dim, ChordIntervals.Dim, ChordStructure.Triad),
	[ChordName.Sus2]: toDefObj(ChordName.Sus2, ChordSymbol.Sus2, ChordIntervals.Sus2, ChordStructure.Sus),
	[ChordName.Sus4]: toDefObj(ChordName.Sus4, ChordSymbol.Sus4, ChordIntervals.Sus4, ChordStructure.Sus),
	[ChordName.P5]: toDefObj(ChordName.P5, ChordSymbol.P5, ChordIntervals.P5, ChordStructure.Triad),
	[ChordName.MajorSix]: toDefObj(ChordName.MajorSix, ChordSymbol.MajorSix, ChordIntervals.MajorSix, ChordStructure.Sixth),
	[ChordName.MinorSix]: toDefObj(ChordName.MinorSix, ChordSymbol.MinorSix, ChordIntervals.MinorSix, ChordStructure.Sixth),
	[ChordName.MinorMajorSix]: toDefObj(ChordName.MinorMajorSix, ChordSymbol.MinorMajorSix, ChordIntervals.MinorMajorSix, ChordStructure.Sixth),
	[ChordName.MinorSixAddNine]: toDefObj(ChordName.MinorSixAddNine, ChordSymbol.MinorSixAddNine, ChordIntervals.MinorSixAddNine, ChordStructure.Sixth),
	[ChordName.MajorSixAddNine]: toDefObj(ChordName.MajorSixAddNine, ChordSymbol.MajorSixAddNine, ChordIntervals.MajorSixAddNine, ChordStructure.Sixth),
	[ChordName.Seven]: toDefObj(ChordName.Seven, ChordSymbol.Seven, ChordIntervals.Seven, ChordStructure.Seventh),
	[ChordName.MinorSeven]: toDefObj(ChordName.MinorSeven, ChordSymbol.MinorSeven, ChordIntervals.MinorSeven, ChordStructure.Seventh),
	[ChordName.MinorSevenFlatFive]: toDefObj(ChordName.MinorSevenFlatFive, ChordSymbol.MinorSevenFlatFive, ChordIntervals.MinorSevenFlatFive, ChordStructure.Seventh),
	[ChordName.MajorSeven]: toDefObj(ChordName.MajorSeven, ChordSymbol.MajorSeven, ChordIntervals.MajorSeven, ChordStructure.Seventh),
	[ChordName.Nine]: toDefObj(ChordName.Nine, ChordSymbol.Nine, ChordIntervals.Nine, ChordStructure.Ninth),
	[ChordName.MinorNine]: toDefObj(ChordName.MinorNine, ChordSymbol.MinorNine, ChordIntervals.MinorNine, ChordStructure.Ninth),
	[ChordName.MajorNine]: toDefObj(ChordName.MajorNine, ChordSymbol.MajorNine, ChordIntervals.MajorNine, ChordStructure.Ninth),
	[ChordName.Eleven]: toDefObj(ChordName.Eleven, ChordSymbol.Eleven, ChordIntervals.Eleven, ChordStructure.Eleventh),
	[ChordName.MinorEleven]: toDefObj(ChordName.MinorEleven, ChordSymbol.MinorEleven, ChordIntervals.MinorEleven, ChordStructure.Eleventh),
	[ChordName.MajorEleven]: toDefObj(ChordName.MajorEleven, ChordSymbol.MajorEleven, ChordIntervals.MajorEleven, ChordStructure.Eleventh),
	[ChordName.Thirteen]: toDefObj(ChordName.Thirteen, ChordSymbol.Thirteen, ChordIntervals.Thirteen, ChordStructure.Thirteenth),
	[ChordName.MinorThirteen]: toDefObj(ChordName.MinorThirteen, ChordSymbol.MinorThirteen, ChordIntervals.MinorThirteen, ChordStructure.Thirteenth),
	[ChordName.MajorThirteen]: toDefObj(ChordName.MajorThirteen, ChordSymbol.MajorThirteen, ChordIntervals.MajorThirteen, ChordStructure.Thirteenth),
};

export type ChordDefinition = typeof ChordDefinition[keyof typeof ChordDefinition];

export const ChordStructures = new Map<ChordStructure, ChordName[]>([
	[ ChordStructure.Triad, [ ChordName.Major, ChordName.Minor, ChordName.Aug, ChordName.Dim, ChordName.Sus2, ChordName.Sus4, ChordName.P5 ] ],
	[ ChordStructure.Sus, [ ChordName.Sus2, ChordName.Sus4 ] ],
	[ ChordStructure.Sixth, [ ChordName.MajorSixAddNine, ChordName.MinorSix, ChordName.MinorMajorSix, ChordName.MinorSixAddNine, ChordName.MajorSixAddNine ] ],
	[ ChordStructure.Seventh, [ ChordName.Seven, ChordName.MinorSeven, ChordName.MinorSevenFlatFive, ChordName.MajorSeven ] ],
	[ ChordStructure.Ninth, [ ChordName.Nine, ChordName.MinorNine, ChordName.MajorNine ] ],
	[ ChordStructure.Eleventh, [ ChordName.Eleven, ChordName.MinorEleven, ChordName.MajorEleven ] ],
	[ ChordStructure.Thirteenth, [ ChordName.Thirteen, ChordName.MinorThirteen, ChordName.MajorThirteen ] ],
]);

