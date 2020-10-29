import { ScaleIntervals, ScaleName } from './scales';

export const GreekMode = <const>{
	[ScaleName.Ionian]: [ 'I', 'tonic' ],
	[ScaleName.Dorian]: [ 'II', 'subdominant' ],
	[ScaleName.Phrygian]: [ 'III', 'mediant' ],
	[ScaleName.Lydian]: [ 'IV', 'subdominant' ],
	[ScaleName.Mixolydian]: [ 'V', 'dominant' ],
	[ScaleName.Aeolian]: [ 'VI', 'submediant' ],
	[ScaleName.Locrian]: [ 'VII', 'leading' ],
};

export type GreekMode = keyof typeof GreekMode;
// 	'Ionian' | 'Dorian' | 'Phrygian' | 'Lydian' | 'Mixolydian' | 'Aeolian' | 'Locrian'>

export const GreekModes = <const>[
	ScaleName.Ionian,
	ScaleName.Dorian,
	ScaleName.Phrygian,
	ScaleName.Lydian,
	ScaleName.Mixolydian,
	ScaleName.Aeolian,
	ScaleName.Locrian,
];

export type GreekModes = typeof GreekModes[number];

export const GreekModeInterval = <const>[
	ScaleIntervals.Ionian,
	ScaleIntervals.Dorian,
	ScaleIntervals.Phrygian,
	ScaleIntervals.Lydian,
	ScaleIntervals.Mixolydian,
	ScaleIntervals.Aeolian,
	ScaleIntervals.Locrian,
];

export type GreekModeInterval = typeof GreekModeInterval[number];

export type ModePosition = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI' | 'VII';


