import ring from '@ricardomatias/ring';
import * as R from 'ramda';
import { roll, distribute } from '@ricardomatias/roll';
import { convert as convertToRoman } from 'roman-numeral';

import { Note, NoteLike } from './Note';
import { Scale } from './Scale';
import { Chord } from './Chord';
import distance from '../tools/distance';
import Random from '../tools/random';
import { Interval } from '../constants/intervals';
import { NoteSymbol } from '../constants/note';
import { ScaleIntervals, ScaleName } from '../constants/scales';
import { ChordIntervals, ChordStructure } from '../constants/chords';
import { GreekModeIntervals, GreekModes, ModePosition } from '../constants/modes';
import { isNotNull, isUndefined } from '../utils/types-guards';
import { PlayaError } from '../utils/error';
import { Octaves } from '../common/types';
import { assureNote } from '../utils';


const TOTAL_MODES = 7;
const LOCRIAN_PROB = 0.01;
const PRECISION = 4;

const MODES_MOD_PROB = distribute.sumDistribution([
	'0.165', '0.165', '0.165', '0.165', '0.165', '0.165', '0.01',
], 3);

type Mode = { scale: GreekModeIntervals, root: NoteSymbol }

/**
 * Mode type
 * @memberof Types
 * @typedef Mode
 * @property {NoteSymbol} root root
 * @property {ScaleIntervals} scale scale
 */

function isModeInterval(mode: ScaleIntervals | string): mode is GreekModeIntervals {
	return Key.isMode(mode);
}

export enum ModulationDirection {
	Up = 'Up',
	Down = 'Down'
}

const AllowedScales = '"Ionian" | "Dorian" | "Phrygian" | "Lydian" | "Mixolydian" | "Aeolian" | "Locrian" | "Major" | "Minor"';

/**
* Defines a Key
* @name Key
* @memberof Core#
* @class
*
* @extends Scale
 */
export class Key extends Scale {
	private _chordStructure: ChordStructure | undefined;
	private _modes: Mode[] = [];
	private _chord: Chord | undefined;

	/**
	* Greek Modes
	*
	* @member Modes
	* @memberof Core#Key
	* @enum
	* @static
	* @type {ScaleName}
	*
	* @example Key.Modes => ['Ionian', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Aeolian', 'Locrian']
	*/
	static readonly Modes = GreekModes;

	constructor(root: NoteSymbol, intervals: GreekModeIntervals);
	constructor(root: Note, intervals: GreekModeIntervals);
	constructor(root: string, intervals: GreekModeIntervals);
	constructor(root: number, intervals: GreekModeIntervals);

	/**
	 * Creates an instance of Key.
	 * @constructs Key
	 * @memberof Core#
	 *
	 * @param {NoteLike} root
	 * @param {ScaleIntervals|string} intervals the type of Scale to create
	 * @param {Array<Number>} [octaves = [ 3, 1]] [starting, number of octaves] range of octaves to map notes to
	 * @param {Object} [opts = {}]
	 * @param {Array<Number>} [opts.chordStructure = Chord.Structures.Seventh ] - f.ex: Chord.Structures.Sixth
	 *
	 * @example
	 * new Key('A', Key.Ionian);
	 * new Key(60, Key.Aeolian);
	 * new Key('A4', Key.Phrygian);
	 * new Key('A', Key.Dorian, [4, 1], { chordStructure: Chord.Structures.Sixth });
	 */
	constructor(
		root: NoteLike,
		intervals: GreekModeIntervals,
		octaves?: Octaves,
		{ chordStructure = Chord.Structures.Seventh }: { chordStructure?: ChordStructure } = {},
	) {
		super(root as any, intervals, octaves);

		if (!isModeInterval(intervals)) {
			// eslint-disable-next-line max-len
			throw new PlayaError('Key', `Please use the Scale class, if the intervals don't belong to one of the following scales: ${AllowedScales}`);
		}

		this._chordStructure = chordStructure;
	}

	/**
	* Gets the modes of the current key
	* @method modes
	* @memberof Core#Key#
	* @example
	* [
	* 	{ scale: '1P 2M 3M 4P 5P 6M 7M', root: 'C' },
	* 	{ scale: '1P 2M 3m 4P 5P 6M 7m', root: 'D' },
	* 	{ scale: '1P 2m 3m 4P 5P 6m 7m', root: 'E' },
	* 	{ scale: '1P 2M 3M 4A 5P 6M 7M', root: 'F' },
	* 	{ scale: '1P 2M 3M 4P 5P 6M 7m', root: 'G' },
	* 	{ scale: '1P 2M 3m 4P 5P 6m 7m', root: 'A' },
	* 	{ scale: '1P 2m 3m 4P 5d 6m 7m', root: 'B' }
	* ]
	*
	* @type {Array<Mode>}
	*/
	get modes(): Mode[] {
		if (R.isEmpty(this._modes)) {
			this.createModes();
		}

		return this._modes;
	}

	/**
	* Returns the scale's intervals
	*
	* @member intervals
	* @memberof Core#Scale#
	* @type {GreekModeIntervals|String}
	*/
	get intervals(): GreekModeIntervals {
		return this._intervals as GreekModeIntervals;
	}

	/**
	* Returns the keys's name
	*
	* @member name
	* @memberof Core#Key#
	* @type {ScaleName|String}
	*/
	get name(): ScaleName | undefined {
		return Key.getModeName(this._intervals);
	}

	/**
	* Modulate key upwards based on an interval
	* @function modulateUp
	* @memberof Core#Key#
	*
	* @param {Interval} [interval = '5P']
	*/
	modulateUp(interval: Interval = '5P'): void {
		this.modulate(Key.ModulateUp, interval);
	}


	/**
	* Modulate key upwards based on an interval
	* @function modulateDown
	* @memberof Core#Key#
	*
	* @param {String} [interval = '5P']
	*/
	modulateDown(interval: Interval = '5P'): void {
		this.modulate(Key.ModulateDown, interval);
	}

	/**
	 * Modulate key based on a direction & interval
	 * @function modulate
	 * @memberof Core#Key#
	 *
	 * @param {Symbol} direction
	 * @param {String} [interval = '5P']
	 */
	modulate(direction: ModulationDirection, interval: Interval = '5P'): void {
		const notes = this._notes;
		const intervals = this._intervals;

		if (!notes.length || !Key.isMode(intervals) || !this.isModulationDirection(direction)) {
			return;
		}

		let root: NoteSymbol | undefined;

		if (direction === Key.ModulateUp) {
			root = distance.transposeUp(notes[0].note, interval);
		} else if (direction === Key.ModulateDown) {
			root = distance.transposeDown(notes[0].note, interval);
		} else {
			return;
		}

		this._root = new Note(root);
		this._notes = this.createScale();

		this.assignOctaves();

		this._modes = [];
	}

	/**
	 * Modulate key within it's relative modes based on a direction & interval
	 * @function modulateMode
	 * @memberof Core#Key#
	 *
	 * @param {Object} [opts = {}]
	 * @param {Symbol} [opts.direction] Key.MOD_UP or Key.MOD_DOWN
	 * @param {Number} [opts.interval] 1..7
	 */
	modulateMode({ direction, interval }: Partial<{ direction: ModulationDirection, interval: number }> = {}): void {
		let mode: Mode;
		let modes = this.modes; // use this so it forces mode creation in case of their absence
		let probabilities = MODES_MOD_PROB;
		const modePos = this.modePosition;

		if (direction && !interval) {
			const splitModes = R.splitAt(modePos, modes);

			if (R.isEmpty(splitModes)) {
				return;
			}

			if (direction === Key.ModulateUp) {
				if (modePos === 6) {
					// * LAST ELEMENT
					// Allow choosing any of the other modes
					modes = R.head(splitModes) as Mode[];
				} else {
					modes = R.tail(<Mode[]>R.last(splitModes));
				}
			}

			if (direction === Key.ModulateDown) {
				if (modePos === 0) {
					// * FIRST ELEMENT
					// Allow choosing any of the other modes
					modes = R.tail(<Mode[]>R.last(splitModes));
				} else {
					modes = R.head(splitModes) as Mode[];
				}
			}

			// Locrian shouldn't be appearing too often
			if (R.includes(Key.Locrian, R.pluck('scale', modes))) {
				const modesLen = modes.length;

				modes = R.sort(R.ascend(R.propEq('scale', Key.Locrian)), modes);

				const avgProb = ((1.0 - LOCRIAN_PROB) / (modesLen - 1.0)).toFixed(PRECISION);

				probabilities = distribute.sumDistribution(modes.map((_, idx) => {
					return idx === modesLen - 1 ? LOCRIAN_PROB.toFixed(PRECISION) : avgProb;
				}), PRECISION);
			} else {
				probabilities = distribute.equal(modes.length, PRECISION);
			}
		}

		if (!interval) {
			mode = roll(modes, probabilities, Random.float);
		} else {
			const dirMultiplier = direction === Key.ModulateDown ? -1 : 1;
			const newModePosition = modePos + ((interval - 1) * dirMultiplier);

			// f.ex: a 3rd is 2 places away not 3
			mode = ring(modes)[newModePosition];
		}

		this._root = new Note(mode.root);
		this._intervals = mode.scale;

		const rootPos = R.findIndex(R.propEq('note', mode.root), this._notes);
		const notesSplit = R.splitAt(rootPos, this._notes);

		this._notes = R.concat(<Note[]>R.last(notesSplit), <Note[]>R.head(notesSplit));

		this.assignOctaves();

		delete this._chord;
	}

	/**
	 * Get the mode position in Roman Numerals
	 * @member modePositionRoman
	 * @memberof Core#Key#
	 *
	 * @type {String}
	 */
	get modePositionRoman(): ModePosition {
		return convertToRoman(this.modePosition + 1) as ModePosition;
	}

	/**
	 * Get the mode index
	 * @function modePosition
	 * @memberof Core#Key#
	 * @private
	 * @return {Number}
	 */
	get modePosition(): number {
		return R.findIndex(R.propEq('root', this.root.note), this.modes);
	}

	/**
	 * Chord belonging to this mode
	 * @member chord
	 * @memberof Core#Key#
	 *
	 * @return {Chord}
	 */
	get chord(): Chord {
		const mode = this._intervals as ChordIntervals;
		const root = this._root.note;
		const structure = this._chordStructure;

		if (!this._chord) {
			this._chord = Chord.fromIntervals(root, mode, structure, this._octaves);
		}

		return this._chord;
	}

	set chordStructure(structure: ChordStructure) {
		this._chordStructure = structure;
	}

	/**
	 * Finds out the index of the scale and of the Ionian mode
	 * @private
	 * @return {Object} [ionianIndex, scaleIndex]
	 * @memberof Key
	 */
	private prepareModes(): { ionianIndex: number, scaleIndex: number } | null {
		let scaleIntervals = this._intervals as GreekModeIntervals;
		const isMajorMinor = this.isMajorMinor(scaleIntervals);

		if (!isMajorMinor && !Key.isMode(scaleIntervals)) {
			return null;
		}

		if (isMajorMinor) {
			scaleIntervals = <GreekModeIntervals>(scaleIntervals === Key.Major ? Key.Ionian : Key.Aeolian);
		}

		const scaleIndex = Array.from(GreekModeIntervals).indexOf(scaleIntervals);

		const ionianIndex = TOTAL_MODES - scaleIndex;

		return {
			ionianIndex,
			scaleIndex,
		};
	}

	/**
	 * Creates the modes of the key
	 * @function createModes
	 * @memberof Core#Key#
	 * @private
	 * @return {Array<Mode>}
	 */
	private createModes(): Mode[] | null {
		const notes = this._notes;

		// Order the notes, starting from the IONIAN mode
		const indices = this.prepareModes();

		if (!isNotNull(indices)) {
			return null;
		}

		const { ionianIndex, scaleIndex } = indices;

		const orderedNotes = notes.slice(ionianIndex, TOTAL_MODES).concat(notes.slice(0, ionianIndex));

		let modes = [];
		let index = 0;

		for (const scale of Array.from(GreekModeIntervals)) {
			const root = orderedNotes[index++].note;

			modes.push({ scale, root });
		}

		// Reverse ordering to go back to initial state;
		modes = modes.slice(scaleIndex, TOTAL_MODES).concat(modes.slice(0, scaleIndex));

		this._modes = modes;

		return modes;
	}

	private isModulationDirection<T>(direction: T | any): direction is ModulationDirection {
		return [ Key.ModulateUp, Key.ModulateDown ].includes(direction);
	}

	/**
	* Get the mode at the position from the modes array
	* @function getModeAtPosition
	* @memberof Core#Key#
	*
	* @param {Number} position [0. 7]
	* @return {Key} same key in a different mode
	*/
	getModeAtPosition(position: number): Key {
		const modes = this.modes;

		const mode = modes[position % 8];

		this._root = new Note(mode.root);
		this._intervals = mode.scale;

		const rootPos = R.findIndex(R.propEq('note', mode.root), this._notes);
		const notesSplit = R.splitAt(rootPos, this._notes);

		this._notes = R.concat(<Note[]>R.last(notesSplit), <Note[]>R.head(notesSplit));

		this.assignOctaves();

		delete this._chord;

		return this;
	}

	/**
	* Get the mode from a note belonging to this key's modes
	* @function getModeFromNote
	* @memberof Core#Key#
	*
	* @param {NoteLike} note
	* @return {Key | undefined} same key in a different mode
	*/
	getModeFromNote(note: NoteLike): Key | undefined {
		const n = assureNote(note);
		const modes = this.modes;
		const position = modes.map((m) => m.root).indexOf(n.note);

		if (position === -1) return;

		return this.getModeAtPosition(position);
	}

	/**
	 * Checks if the scale is Major or Minor
	 * @private
	 * @param {ScaleIntervals} intervals
	 * @return {Boolean} isMajorMinor
	 * @memberof Scale
	 */
	private isMajorMinor(intervals: ScaleIntervals): boolean {
		return (<ScaleIntervals[]>[ Scale.Major, Scale.Minor ]).indexOf(intervals) !== -1;
	}

	static getModeName(intervals: GreekModeIntervals | string): ScaleName | undefined {
		let name = Scale.getName(intervals);

		if (isUndefined(name)) return;

		if (name === ScaleName.Major || name === ScaleName.Minor) {
			name = name === ScaleName.Major ? ScaleName.Ionian : ScaleName.Aeolian;
		}

		return name;
	}

	/**
	 * Checks if the key is a mode
	 * @function isMode
	 * @memberof Core#Key
	 * @static
	 * @param {String} mode
	 * @return {Boolean}
	 */
	static isMode(mode: ScaleIntervals | string): boolean {
		return GreekModeIntervals.includes(mode as GreekModeIntervals);
	}

	/**
	* Converts modes to Chord
	* @function modesToChords
	* @memberof Core#Key
	* @static
	* @param {Mode[]} modes
	* @return {Chord[]}
	*/
	static modesToChords(modes: Mode[]): Chord[] {
		return modes.map((mode) => {
			return Chord.fromIntervals(
				mode.root,
				mode.scale,
				Chord.Structures.Seventh,
			);
		});
	}

	/**
	* Converts modes to Key
	* @function modesToKeys
	* @memberof Core#Key
	* @static
	* @param {Mode[]} modes
	* @return {Key[]}
	*/
	static modesToKeys(modes: Mode[]): Key[] {
		return modes.map((mode): Key => {
			return new Key(mode.root, mode.scale);
		});
	}

	/**
	* Ionian mode in the current key
	*
	* @member I
	* @memberof Core#Key#
	* @type {Key}
	*/
	get I(): Key {
		return this.getModeAtPosition(0);
	}

	/**
	* Dorian mode in the current key
	*
	* @member II
	* @memberof Core#Key#
	* @type {Key}
	*/
	get II(): Key {
		return this.getModeAtPosition(1);
	}

	/**
	* Phrygian mode in the current key
	*
	* @member III
	* @memberof Core#Key#
	* @type {Key}
	*/
	get III(): Key {
		return this.getModeAtPosition(2);
	}


	/**
	* Lydian mode in the current key
	*
	* @member IV
	* @memberof Core#Key#
	* @type {Key}
	*/
	get IV(): Key {
		return this.getModeAtPosition(3);
	}

	/**
	* Mixolydian mode in the current key
	*
	* @member V
	* @memberof Core#Key#
	* @type {Key}
	*/
	get V(): Key {
		return this.getModeAtPosition(4);
	}

	/**
	* Aeolian mode in the current key
	*
	* @member VI
	* @memberof Core#Key#
	* @type {Key}
	*/
	get VI(): Key {
		return this.getModeAtPosition(5);
	}

	/**
	* Locrian mode in the current key
	*
	* @member VII
	* @memberof Core#Key#
	* @type {Key}
	*/
	get VII(): Key {
		return this.getModeAtPosition(6);
	}

	static ModulateUp = ModulationDirection.Up;
	static ModulateDown = ModulationDirection.Down;
	// from bland to spicy
	static ModulationIntervals = <const>[ '4P', '5P', '2M', '7m', '3m', '6M', '3M', '6m', '2m', '7M' ];
}


