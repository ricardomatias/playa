import { ScaleIntervals, ScaleName } from './scales';

// export const Mode = <const>{
// 	[ScaleName.Ionian]: [ 'I', 'tonic' ],
// 	[ScaleName.Dorian]: [ 'II', 'subdominant' ],
// 	[ScaleName.Phrygian]: [ 'III', 'mediant' ],
// 	[ScaleName.Lydian]: [ 'IV', 'subdominant' ],
// 	[ScaleName.Mixolydian]: [ 'V', 'dominant' ],
// 	[ScaleName.Aeolian]: [ 'VI', 'submediant' ],
// 	[ScaleName.Locrian]: [ 'VII', 'leading' ],
// };

// export type Mode = keyof typeof Mode;
// 	'Ionian, 'Dorian' , 'Phrygian' , 'Lydian' , 'Mixolydian' , 'Aeolian' , 'Locrian'>

/**
 * Modes
 * @memberof Constants
 * @typedef {Array<'Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian'>} Modes
 * @enum
 * @default
 */
export const Modes = <const>[
	ScaleName.Ionian,
	ScaleName.Dorian,
	ScaleName.Phrygian,
	ScaleName.Lydian,
	ScaleName.Mixolydian,
	ScaleName.Aeolian,
	ScaleName.Locrian,
];

export type Modes = typeof Modes[number];

/**
 * Mode Intervals
 * @memberof Constants
 * @typedef {ScaleIntervals[]} ModeIntervals
 * @enum
 * @default
 */
export const ModeIntervals = <const>[
	ScaleIntervals.Ionian,
	ScaleIntervals.Dorian,
	ScaleIntervals.Phrygian,
	ScaleIntervals.Lydian,
	ScaleIntervals.Mixolydian,
	ScaleIntervals.Aeolian,
	ScaleIntervals.Locrian,
];

export type ModeIntervals = typeof ModeIntervals[number];

export type ModePosition = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';


