// *****************************************************************************
// SCALES
// *****************************************************************************

/**
 * Scale Name
 * @memberof Constants
 * @typedef {string} ScaleName
 * @enum
 * @example
 * ScaleName.Major => 'Major'
 */
export const ScaleName = <const>{
	/**
	 * Lydian
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Lydian: 'Lydian',
	/**
	 * Major
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Major: 'Major',
	/**
	 * Ionian
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Ionian: 'Ionian',
	/**
	 * Mixolydian
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Mixolydian: 'Mixolydian',
	/**
	 * Minor
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Minor: 'Minor',
	/**
	 * Aeolian
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Aeolian: 'Aeolian',
	/**
	 * Dorian
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Dorian: 'Dorian',
	/**
	 * Phrygian
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Phrygian: 'Phrygian',
	/**
	 * Locrian
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Locrian: 'Locrian',
	/**
	 * Major Pentatonic
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	MajorPentatonic: 'MajorPentatonic',
	/**
	 * Minor Pentatonic
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	MinorPentatonic: 'MinorPentatonic',
	/**
	 * Egyptian
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Egyptian: 'Egyptian',
	/**
	 * Melodic Minor
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	MelodicMinor: 'MelodicMinor',
	/**
	 * Altered
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Altered: 'Altered',
	/**
	 * Harmonic Minor
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	HarmonicMinor: 'HarmonicMinor',
	/**
	 * Chromatic
	 * @type {ScaleName}
	 * @memberof Constants.ScaleName
	 * @default
	 * @readonly
	 */
	Chromatic: 'Chromatic',
};

export type ScaleName = typeof ScaleName[keyof typeof ScaleName];

/**
 * Scale Intervals
 * @memberof Constants
 * @typedef {string} ScaleIntervals
 * @param {ScaleName}
 * @enum
 * @example
 * ScaleInterval.Major => '1P 2M 3M 4P 5P 6M 7M'
 */
export const ScaleIntervals = <const>{
	/**
	 * Lydian
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Lydian: '1P 2M 3M 4A 5P 6M 7M',
	/**
	 * Major
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Major: '1P 2M 3M 4P 5P 6M 7M',
	/**
	 * Ionian
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Ionian: '1P 2M 3M 4P 5P 6M 7M',
	/**
	 * Mixolydian
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Mixolydian: '1P 2M 3M 4P 5P 6M 7m',
	/**
	 * Minor
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Minor: '1P 2M 3m 4P 5P 6m 7m',
	/**
	 * Aeolian
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Aeolian: '1P 2M 3m 4P 5P 6m 7m',
	/**
	 * Dorian
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Dorian: '1P 2M 3m 4P 5P 6M 7m',
	/**
	 * Phrygian
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Phrygian: '1P 2m 3m 4P 5P 6m 7m',
	/**
	 * Locrian
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Locrian: '1P 2m 3m 4P 5d 6m 7m',
	/**
	 * Major Pentatonic
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	MajorPentatonic: '1P 2M 3M 5P 6M',
	/**
	 * Minor Pentatonic
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	MinorPentatonic: '1P 3m 4P 5P 7m',
	/**
	 * Egyptian
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Egyptian: '1P 2M 4P 5P 7m',
	/**
	 * Melodic Minor
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	MelodicMinor: '1P 2M 3m 4P 5P 6M 7M',
	/**
	 * Altered
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Altered: '1P 2m 3m 3M 5d 6m 7m',
	/**
	 * Harmonic Minor
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	HarmonicMinor: '1P 2M 3m 4P 5P 6m 7M',
	/**
	 * Chromatic
	 * @type {ScaleIntervals}
	 * @memberof Constants.ScaleIntervals
	 * @default
	 * @readonly
	 */
	Chromatic: '1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M',
};

export type ScaleIntervals = typeof ScaleIntervals[ScaleName];

export const Scales = new Map<ScaleName, ScaleIntervals>([
	[ ScaleName.Lydian, ScaleIntervals.Lydian ],
	[ ScaleName.Major, ScaleIntervals.Major ],
	[ ScaleName.Ionian, ScaleIntervals.Ionian ],
	[ ScaleName.Mixolydian, ScaleIntervals.Mixolydian ],
	[ ScaleName.Minor, ScaleIntervals.Minor ],
	[ ScaleName.Aeolian, ScaleIntervals.Aeolian ],
	[ ScaleName.Dorian, ScaleIntervals.Dorian ],
	[ ScaleName.Phrygian, ScaleIntervals.Phrygian ],
	[ ScaleName.Locrian, ScaleIntervals.Locrian ],
	[ ScaleName.MajorPentatonic, ScaleIntervals.MajorPentatonic ],
	[ ScaleName.MinorPentatonic, ScaleIntervals.MinorPentatonic ],
	[ ScaleName.Egyptian, ScaleIntervals.Egyptian ],
	[ ScaleName.MelodicMinor, ScaleIntervals.MelodicMinor ],
	[ ScaleName.Altered, ScaleIntervals.Altered ],
	[ ScaleName.HarmonicMinor, ScaleIntervals.HarmonicMinor ],
]);
