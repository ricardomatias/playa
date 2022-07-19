import { Notevalue } from '../../constants';

/**
 * Rhythm Presets
 * @memberof Composition.Rhythm
 * @typedef {Notevalue[]} Presets
 * @enum
 * @example
 * Rhythm.Presets.Robotic => [ '8n', '16n', '32n' ]
 */
export const Presets = <const>{
	/**
	 * Mixed
	 * @type {Notevalue[]}
	 * @memberof Composition.Rhythm.Presets
	 * @default
	 * @readonly
	 */
	Mixed: <Notevalue[]>['4n', '8n', '4nt', '4nd', '8nt', '8nd', '16n'],
	/**
	 * Slow
	 * @type {Notevalue[]}
	 * @memberof Composition.Rhythm.Presets
	 * @default
	 * @readonly
	 */
	Slow: <Notevalue[]>['2n', '4nd', '2nd', '4n'],
	/**
	 * Robotic
	 * @type {Notevalue[]}
	 * @memberof Composition.Rhythm.Presets
	 * @default
	 * @readonly
	 */
	Robotic: <Notevalue[]>['8n', '16n', '32n'],
	/**
	 * Straight
	 * @type {Notevalue[]}
	 * @memberof Composition.Rhythm.Presets
	 * @default
	 * @readonly
	 */
	Straight: <Notevalue[]>['2n', '4n', '8n', '16n'],
	/**
	 * Common
	 * @type {Notevalue[]}
	 * @memberof Composition.Rhythm.Presets
	 * @default
	 * @readonly
	 */
	Common: <Notevalue[]>['4n', '8n', '16n', '4nt', '8nt', '4nd'],
};

export type Presets = typeof Presets[keyof typeof Presets];
