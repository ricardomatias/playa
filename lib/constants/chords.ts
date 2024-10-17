/* eslint max-len: 0 */
// *****************************************************************************
// CHORDS
// *****************************************************************************

import { Interval } from './intervals';

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
	MajorSixth: 'MajorSixth',
	/**
	 * Minor 6th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorSixth: 'MinorSixth',
	/**
	 * Minor triad, major 6th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorMajorSixth: 'MinorMajorSixth',
	/**
	 * Minor 6th added 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorSixthAddNine: 'MinorSixthAddNine',
	/**
	 * Major 6th added 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorSixthAddNine: 'MajorSixthAddNine',
	/**
	 * Dominant 7th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	DominantSeventh: 'DominantSeventh',
	/**
	 * Minor 7th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorSeventh: 'MinorSeventh',
	/**
	 * Minor 7th flat 5 chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorSeventhFlatFive: 'MinorSeventhFlatFive',
	/**
	 * Major 7th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorSeventh: 'MajorSeventh',
	/**
	 * Major 7th flat 6th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorSeventhFlatSixth: 'MajorSeventhFlatSixth',
	/**
	 * 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Ninth: 'Ninth',
	/**
	 * Minor 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorNinth: 'MinorNinth',
	/**
	 * Major 9th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorNinth: 'MajorNinth',
	/**
	 * 11th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Eleventh: 'Eleventh',
	/**
	 * Minor 11th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorEleventh: 'MinorEleventh',
	/**
	 * Major 11th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorEleventh: 'MajorEleventh',
	/**
	 * 13th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	Thirteenth: 'Thirteenth',
	/**
	 * Minor 13th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MinorThirteenth: 'MinorThirteenth',
	/**
	 * Major 13th chord
	 * @type {string}
	 * @memberof Constants.ChordName
	 * @default
	 * @readonly
	 */
	MajorThirteenth: 'MajorThirteenth',
};

/**
 * Chord Name
 *
 * @typedef {string} ChordName
 * @memberof Types
 */

export type ChordName = (typeof ChordName)[keyof typeof ChordName];

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
	MajorSixth: '6',
	/**
	 * Minor 6th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorSixth: 'm6m',
	/**
	 * Minor triad, major 6th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorMajorSixth: 'm6',
	/**
	 * Minor 6th added 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorSixthAddNine: 'm6add9',
	/**
	 * Major 6th added 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorSixthAddNine: '6add9',
	/**
	 * Dominant 7th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	DominantSeventh: '7',
	/**
	 * Minor 7th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorSeventh: 'm7',
	/**
	 * Minor 7th flat 5 chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorSeventhFlatFive: 'm7b5',
	/**
	 * Major 7th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorSeventh: 'M7',
	/**
	 * Major 7th flat 6th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorSeventhFlatSixth: 'M7b6',
	/**
	 * 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Ninth: '9',
	/**
	 * Minor 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorNinth: 'm9',
	/**
	 * Major 9th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorNinth: 'M9',
	/**
	 * 11th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Eleventh: '11',
	/**
	 * Minor 11th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorEleventh: 'm11',
	/**
	 * Major 11th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorEleventh: 'M11',
	/**
	 * 13th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	Thirteenth: '13',
	/**
	 * Minor 13th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MinorThirteenth: 'm13',
	/**
	 * Major 13th chord
	 * @type {ChordSymbol}
	 * @memberof Constants.ChordSymbol
	 * @default
	 * @readonly
	 */
	MajorThirteenth: 'M13',
} as const;

export type ChordSymbol = (typeof ChordSymbol)[ChordName];

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
	Major: '1P 3M 5P',
	/**
	 * Minor triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	Minor: '1P 3m 5P',
	/**
	 * Augmented 5th triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	Aug: '1P 3M 5A',
	/**
	 * Diminished 5th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	Dim: '1P 3m 5d',
	/**
	 * Suspended 2nd triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	Sus2: '1P 2M 5P',
	/**
	 * Suspended 4th triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	Sus4: '1P 4P 5P',
	/**
	 * Power triad
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	P5: '1P 5P 8P',
	/**
	 * Major 6th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MajorSixth: '1P 3M 5P 6M',
	/**
	 * Minor 6th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MinorSixth: '1P 3m 5P 6m',
	/**
	 * Minor triad, major 6th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MinorMajorSixth: '1P 3m 5P 6M',
	/**
	 * Minor 6th added 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MinorSixthAddNine: '1P 3M 5P 6m 9M',
	/**
	 * Major 6th added 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MajorSixthAddNine: '1P 3M 5P 6M 9M',
	/**
	 * Dominant 7th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	DominantSeventh: '1P 3M 5P 7m',
	/**
	 * Minor 7th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MinorSeventh: '1P 3m 5P 7m',
	/**
	 * Minor 7th flat 5 chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MinorSeventhFlatFive: '1P 3m 5d 7m',
	/**
	 * Major 7th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MajorSeventh: '1P 3M 5P 7M',
	/**
	 * Major 7th flat 6th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MajorSeventhFlatSixth: '1P 3M 6m 7M',
	/**
	 * 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	Ninth: '1P 3M 5P 7m 9M',
	/**
	 * Minor 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MinorNinth: '1P 3m 5P 7m 9M',
	/**
	 * Major 9th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MajorNinth: '1P 3M 5P 7M 9M',
	/**
	 * 11th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	Eleventh: '1P 3M 5P 7m 9M 11P',
	/**
	 * Minor 11th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MinorEleventh: '1P 3m 5P 7m 9M 11P',
	/**
	 * Major 11th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MajorEleventh: '1P 3M 5P 7M 9M 11P',
	/**
	 * 13th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	Thirteenth: '1P 3M 5P 7m 9M 13M',
	/**
	 * Minor 13th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MinorThirteenth: '1P 3m 5P 7m 9M 13M',
	/**
	 * Major 13th chord
	 * @type {string}
	 * @memberof Constants.ChordIntervals
	 * @default
	 * @readonly
	 */
	MajorThirteenth: '1P 3M 5P 7M 9M 13M',
};

export type ChordIntervals = (typeof ChordIntervals)[ChordName];

export const ChordIntervalRelations = <const>{
	'1P': '',
	'2m': 'b9',
	'2M': 'sus2',
	'3m': 'm',
	'3M': 'M',
	'4P': 'sus4',
	'4A': 'b5',
	'5d': 'b5',
	'5P': '5',
	'5A': 'aug',
	'6m': 'aug',
	'6M': '6',
	'7m': '7',
	'7M': 'maj7',
	'8P': '',
	'9m': 'addb9',
	'9M': 'add9',
	'11P': '11',
	'11A': 'add#11',
	'13m': 'b13',
	'13M': '13',
};

export type ChordIntervalRelations = (typeof ChordIntervalRelations)[Interval];

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
 * ChordStructure.Triad => [ '1 3 5' ]
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
	Triad: ['1 3 5', '1 5 8'],
	/**
	 * Suspended chords structure
	 * @type {ChordStructure}
	 * @memberof Constants.ChordStructure
	 * @default
	 * @readonly
	 * @constant
	 */
	Sus: ['1 2 5', '1 4 5'],
	/**
	 * Sixth chords structure
	 * @type {ChordStructure}
	 * @memberof Constants.ChordStructure
	 * @default
	 * @readonly
	 * @constant
	 */
	Sixth: ['1 3 5 6'],
	/**
	 * Seventh chords structure
	 * @type {ChordStructure}
	 * @memberof Constants.ChordStructure
	 * @default
	 * @readonly
	 * @constant
	 */
	Seventh: ['1 3 5 7'],
	/**
	 * Ninth chords structure
	 * @type {ChordStructure}
	 * @memberof Constants.ChordStructure
	 * @default
	 * @readonly
	 * @constant
	 */
	Ninth: ['1 3 5 7 9'],
	/**
	 * Eleventh chords structure
	 * @type {ChordStructure}
	 * @memberof Constants.ChordStructure
	 * @default
	 * @readonly
	 * @constant
	 */
	Eleventh: ['1 3 5 7 9 11'],
	/**
	 * Thirteenth chords structure
	 * @type {ChordStructure}
	 * @memberof Constants.ChordStructure
	 * @default
	 * @readonly
	 * @constant
	 */
	Thirteenth: ['1 3 5 7 9 13'],
};

export type ChordStructure = (typeof ChordStructure)[keyof typeof ChordStructure];

const toDefObj = (name: ChordName, symbol: ChordSymbol, intervals: ChordIntervals, structure: ChordStructure) => ({
	name,
	symbol,
	intervals,
	structure,
});

export const ChordDefinition = <const>{
	[ChordName.Major]: toDefObj(ChordName.Major, ChordSymbol.Major, ChordIntervals.Major, ChordStructure.Triad),
	[ChordName.Minor]: toDefObj(ChordName.Minor, ChordSymbol.Minor, ChordIntervals.Minor, ChordStructure.Triad),
	[ChordName.Aug]: toDefObj(ChordName.Aug, ChordSymbol.Aug, ChordIntervals.Aug, ChordStructure.Triad),
	[ChordName.Dim]: toDefObj(ChordName.Dim, ChordSymbol.Dim, ChordIntervals.Dim, ChordStructure.Triad),
	[ChordName.Sus2]: toDefObj(ChordName.Sus2, ChordSymbol.Sus2, ChordIntervals.Sus2, ChordStructure.Sus),
	[ChordName.Sus4]: toDefObj(ChordName.Sus4, ChordSymbol.Sus4, ChordIntervals.Sus4, ChordStructure.Sus),
	[ChordName.P5]: toDefObj(ChordName.P5, ChordSymbol.P5, ChordIntervals.P5, ChordStructure.Triad),
	[ChordName.MajorSixth]: toDefObj(
		ChordName.MajorSixth,
		ChordSymbol.MajorSixth,
		ChordIntervals.MajorSixth,
		ChordStructure.Sixth
	),
	[ChordName.MinorSixth]: toDefObj(
		ChordName.MinorSixth,
		ChordSymbol.MinorSixth,
		ChordIntervals.MinorSixth,
		ChordStructure.Sixth
	),
	[ChordName.MinorMajorSixth]: toDefObj(
		ChordName.MinorMajorSixth,
		ChordSymbol.MinorMajorSixth,
		ChordIntervals.MinorMajorSixth,
		ChordStructure.Sixth
	),
	[ChordName.MinorSixthAddNine]: toDefObj(
		ChordName.MinorSixthAddNine,
		ChordSymbol.MinorSixthAddNine,
		ChordIntervals.MinorSixthAddNine,
		ChordStructure.Sixth
	),
	[ChordName.MajorSixthAddNine]: toDefObj(
		ChordName.MajorSixthAddNine,
		ChordSymbol.MajorSixthAddNine,
		ChordIntervals.MajorSixthAddNine,
		ChordStructure.Sixth
	),
	[ChordName.DominantSeventh]: toDefObj(
		ChordName.DominantSeventh,
		ChordSymbol.DominantSeventh,
		ChordIntervals.DominantSeventh,
		ChordStructure.Seventh
	),
	[ChordName.MinorSeventh]: toDefObj(
		ChordName.MinorSeventh,
		ChordSymbol.MinorSeventh,
		ChordIntervals.MinorSeventh,
		ChordStructure.Seventh
	),
	[ChordName.MinorSeventhFlatFive]: toDefObj(
		ChordName.MinorSeventhFlatFive,
		ChordSymbol.MinorSeventhFlatFive,
		ChordIntervals.MinorSeventhFlatFive,
		ChordStructure.Seventh
	),
	[ChordName.MajorSeventh]: toDefObj(
		ChordName.MajorSeventh,
		ChordSymbol.MajorSeventh,
		ChordIntervals.MajorSeventh,
		ChordStructure.Seventh
	),
	[ChordName.MajorSeventhFlatSixth]: toDefObj(
		ChordName.MajorSeventhFlatSixth,
		ChordSymbol.MajorSeventhFlatSixth,
		ChordIntervals.MajorSeventhFlatSixth,
		ChordStructure.Seventh
	),
	[ChordName.Ninth]: toDefObj(ChordName.Ninth, ChordSymbol.Ninth, ChordIntervals.Ninth, ChordStructure.Ninth),
	[ChordName.MinorNinth]: toDefObj(
		ChordName.MinorNinth,
		ChordSymbol.MinorNinth,
		ChordIntervals.MinorNinth,
		ChordStructure.Ninth
	),
	[ChordName.MajorNinth]: toDefObj(
		ChordName.MajorNinth,
		ChordSymbol.MajorNinth,
		ChordIntervals.MajorNinth,
		ChordStructure.Ninth
	),
	[ChordName.Eleventh]: toDefObj(ChordName.Eleventh, ChordSymbol.Eleventh, ChordIntervals.Eleventh, ChordStructure.Eleventh),
	[ChordName.MinorEleventh]: toDefObj(
		ChordName.MinorEleventh,
		ChordSymbol.MinorEleventh,
		ChordIntervals.MinorEleventh,
		ChordStructure.Eleventh
	),
	[ChordName.MajorEleventh]: toDefObj(
		ChordName.MajorEleventh,
		ChordSymbol.MajorEleventh,
		ChordIntervals.MajorEleventh,
		ChordStructure.Eleventh
	),
	[ChordName.Thirteenth]: toDefObj(
		ChordName.Thirteenth,
		ChordSymbol.Thirteenth,
		ChordIntervals.Thirteenth,
		ChordStructure.Thirteenth
	),
	[ChordName.MinorThirteenth]: toDefObj(
		ChordName.MinorThirteenth,
		ChordSymbol.MinorThirteenth,
		ChordIntervals.MinorThirteenth,
		ChordStructure.Thirteenth
	),
	[ChordName.MajorThirteenth]: toDefObj(
		ChordName.MajorThirteenth,
		ChordSymbol.MajorThirteenth,
		ChordIntervals.MajorThirteenth,
		ChordStructure.Thirteenth
	),
};

export type ChordDefinition = (typeof ChordDefinition)[keyof typeof ChordDefinition];

export const SimilarChordsByStructure = new Map<ChordStructure, ChordName[]>([
	[ChordStructure.Triad, [ChordName.Major, ChordName.Minor, ChordName.Aug, ChordName.Dim, ChordName.P5]],
	[ChordStructure.Sus, [ChordName.Sus2, ChordName.Sus4]],
	[
		ChordStructure.Sixth,
		[ChordName.MajorSixthAddNine, ChordName.MinorSixth, ChordName.MinorMajorSixth, ChordName.MinorSixthAddNine],
	],
	[
		ChordStructure.Seventh,
		[
			ChordName.DominantSeventh,
			ChordName.MinorSeventh,
			ChordName.MinorSeventhFlatFive,
			ChordName.MajorSeventh,
			ChordName.MajorSeventhFlatSixth,
		],
	],
	[ChordStructure.Ninth, [ChordName.Ninth, ChordName.MinorNinth, ChordName.MajorNinth]],
	[ChordStructure.Eleventh, [ChordName.Eleventh, ChordName.MinorEleventh, ChordName.MajorEleventh]],
	[ChordStructure.Thirteenth, [ChordName.Thirteenth, ChordName.MinorThirteenth, ChordName.MajorThirteenth]],
]);
