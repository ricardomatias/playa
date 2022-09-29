import ring from '@ricardomatias/ring';
import * as R from 'ramda';
import { roll, distribute } from '@ricardomatias/roll';
import { convert as convertToRoman } from 'roman-numeral';

import { Note, NoteLike } from './Note';
import { Scale } from './Scale';
import { Chord } from './Chord';
import random from '../tools/random';
import { separate } from '../tools/interval';
import { Interval } from '../constants/intervals';
import { NoteSymbol } from '../constants/note';
import { ScaleIntervals, ScaleName } from '../constants/scales';
import { ChordIntervals, ChordStructure } from '../constants/chords';
import { ModeIntervals, Modes, ModePosition } from '../constants/modes';
import { isNotNull, isUndefined } from '../utils/types-guards';
import { PlayaError } from '../utils/error';
import { Octaves } from '../common/types';

const LOCRIAN_PROB = 0.01;
const PRECISION = 4;

type Mode = { scale: ModeIntervals; root: NoteSymbol };

/**
 * Mode type
 * @memberof Types
 * @typedef Mode
 * @property {NoteSymbol} root root
 * @property {ScaleIntervals} scale scale
 */

function isModeInterval(mode: ScaleIntervals | string): mode is ModeIntervals {
	return Key.isMode(mode);
}

export enum ModulationDirection {
	Up = 'Up',
	Down = 'Down',
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
	static readonly Modes = Modes;

	constructor(root: NoteSymbol, intervals: ModeIntervals, octaves?: Octaves, opts?: { chordStructure?: ChordStructure });
	constructor(root: Note, intervals: ModeIntervals, octaves?: Octaves, opts?: { chordStructure?: ChordStructure });
	constructor(root: string, intervals: ModeIntervals, octaves?: Octaves, opts?: { chordStructure?: ChordStructure });
	constructor(root: number, intervals: ModeIntervals, octaves?: Octaves, opts?: { chordStructure?: ChordStructure });

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
		intervals: ModeIntervals,
		octaves?: Octaves,
		{ chordStructure = Chord.Structures.Seventh }: { chordStructure?: ChordStructure } = {}
	) {
		super(root as any, intervals, octaves);

		if (!isModeInterval(intervals)) {
			// eslint-disable-next-line max-len
			throw new PlayaError(
				'Key',
				`Please use the Scale class, if the intervals don't belong to one of the following scales: ${AllowedScales}`
			);
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
	 * @memberof Core#Key#
	 * @type {ModeIntervals|String}
	 */
	get intervals(): ModeIntervals {
		return this._intervals as ModeIntervals;
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
	 *
	 * @return {this}
	 */
	modulateUp(interval: Interval = '5P'): this {
		this.modulate(Key.ModulateUp, interval);

		return this;
	}

	/**
	 * Modulate key upwards based on an interval
	 * @function modulateDown
	 * @memberof Core#Key#
	 *
	 * @param {String} [interval = '5P']
	 * @return {this}
	 */
	modulateDown(interval: Interval = '5P'): this {
		this.modulate(Key.ModulateDown, interval);

		return this;
	}

	/**
	 * Modulate key based on a direction & interval
	 * @function modulate
	 * @memberof Core#Key#
	 *
	 * @param {Symbol} direction
	 * @param {String} [interval = '5P']
	 * @return {this}
	 */
	modulate(direction: ModulationDirection, interval: Interval = '5P'): this {
		const notes = this._notes;
		const intervals = this._intervals;

		if (!notes.length || !Key.isMode(intervals) || !this.isModulationDirection(direction)) {
			return this;
		}

		let root: NoteSymbol | undefined;

		if (direction === Key.ModulateUp) {
			root = Note.transposeUp(notes[0].note, interval);
		} else if (direction === Key.ModulateDown) {
			root = Note.transposeDown(notes[0].note, interval);
		} else {
			return this;
		}

		if (root && !Key.CircleOfFifths.includes(root)) {
			const newRoot = new Note(root);

			this._root = newRoot.enharmonic ? new Note(newRoot.enharmonic) : newRoot;
		} else {
			this._root = new Note(root);
		}

		this.createNotes(separate(this._intervals));

		this.assignOctaves();

		this._modes = [];

		return this;
	}

	/**
	 * Modulate key within it's relative modes based on a direction & interval
	 * @function modulateMode
	 * @memberof Core#Key#
	 *
	 * @param {Object} [opts = {}]
	 * @param {Symbol} [opts.direction] Key.MOD_UP or Key.MOD_DOWN
	 * @param {Number} [opts.interval] 1..7
	 * @return {this}
	 */
	modulateMode({ direction, interval }: Partial<{ direction: ModulationDirection; interval: number }> = {}): this {
		let mode: Mode;
		let modes = this.modes; // use this so it forces mode creation in case of their absence
		let probabilities: string[] = Array.from(Key.ModesModulationProbabilities);
		const modePos = this.modePosition;

		if (direction && !interval) {
			const splitModes = R.splitAt(modePos, modes);

			if (R.isEmpty(splitModes)) {
				return this;
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

			// TODO: Find a way to remove this hack
			// Locrian shouldn't be appearing too often
			if (R.includes(Key.Locrian, R.pluck('scale', modes))) {
				const modesLen = modes.length;

				modes = R.sort(R.ascend(R.propEq('scale', Key.Locrian)), modes);

				const avgProb = ((1.0 - LOCRIAN_PROB) / (modesLen - 1.0)).toFixed(PRECISION);

				probabilities = distribute.sumDistribution(
					modes.map((_, idx) => {
						return idx === modesLen - 1 ? LOCRIAN_PROB.toFixed(PRECISION) : avgProb;
					}),
					PRECISION
				);
			} else {
				probabilities = distribute.equal(modes.length, PRECISION);
			}
		}

		if (modes.length === 1) {
			mode = modes[0];
		} else if (!interval) {
			mode = roll(modes, probabilities, random.float);
		} else {
			const dirMultiplier = direction === Key.ModulateDown ? -1 : 1;
			const newModePosition = modePos + (interval - 1) * dirMultiplier;

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

		return this;
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
	 * @return {number} ionianIndex
	 * @memberof Key
	 */
	private prepareModes(): number | null {
		let scaleIntervals = this._intervals as ModeIntervals;
		const isMajorMinor = this.isMajorMinor(scaleIntervals);

		if (!isMajorMinor && !Key.isMode(scaleIntervals)) {
			return null;
		}

		if (isMajorMinor) {
			scaleIntervals = <ModeIntervals>(scaleIntervals === Key.Major ? Key.Ionian : Key.Aeolian);
		}

		const scaleIndex = Array.from(ModeIntervals).indexOf(scaleIntervals);

		const ionianIndex = ModeIntervals.length - scaleIndex;

		return ionianIndex;
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
		const ionianIndex = this.prepareModes();

		if (!isNotNull(ionianIndex)) {
			return null;
		}

		const orderedNotes = notes.slice(ionianIndex, ModeIntervals.length).concat(notes.slice(0, ionianIndex));

		const modes = [];
		let index = 0;

		for (const scale of Array.from(ModeIntervals)) {
			const root = orderedNotes[index++].note;

			modes.push({ scale, root });
		}

		this._modes = modes;

		return modes;
	}

	private isModulationDirection<T>(direction: T | any): direction is ModulationDirection {
		return [Key.ModulateUp, Key.ModulateDown].includes(direction);
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

		const mode = modes[position % 7];

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
		const n = new Note(note);
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
	 * @memberof Core#Key
	 */
	private isMajorMinor(intervals: ScaleIntervals): boolean {
		return (<ScaleIntervals[]>[Scale.Major, Scale.Minor]).indexOf(intervals) !== -1;
	}

	static getModeName(intervals: ModeIntervals | string): ScaleName | undefined {
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
		return ModeIntervals.includes(mode as ModeIntervals);
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
			return Chord.fromIntervals(mode.root, mode.scale, Chord.Structures.Seventh);
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
	 * Checks if both keys in the same key
	 * @function modesToKeys
	 * @memberof Core#Key
	 * @static
	 * @param {Mode[]} modes
	 * @return {Key[]}
	 */
	static inSameKey(a: Key, b: Key): boolean {
		return R.any(R.equals({ root: b.root.note, scale: b.intervals }), a.modes);
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

	/**
	 * Modulate Up symbol (towards the right in the circle of fifths)
	 *
	 * @member ModulateUp
	 * @memberof Core#Key
	 * @enum
	 * @static
	 * @type {ModulationDirection}
	 *
	 * @example Key.ModulateUp = 'Up'
	 */
	static ModulateUp = ModulationDirection.Up;

	/**
	 * Modulate Down symbol (towards the left in the circle of fifths)
	 *
	 * @member ModulateDown
	 * @memberof Core#Key
	 * @enum
	 * @static
	 * @type {ModulationDirection}
	 *
	 * @example Key.ModulateDown = 'Down'
	 */
	static ModulateDown = ModulationDirection.Down;

	/**
	 * Modulation intervals sorted from consonant to dissonant
	 *
	 * @member ModulationIntervals
	 * @memberof Core#Key
	 * @enum
	 * @static
	 * @type {Interval[]}
	 */
	static ModulationIntervals: Readonly<Interval[]> = <const>['4P', '5P', '2M', '7m', '3m', '6M', '3M', '6m', '2m', '7M'];

	/**
	 * The Circle of Fifths used in `modulate` to know which root notes are allowed
	 * https://en.wikipedia.org/wiki/Circle_of_fifths
	 *
	 * @member ModulationIntervals
	 * @memberof Core#Key
	 * @static
	 * @type {NoteSymbol[]}
	 */
	static CircleOfFifths: Readonly<NoteSymbol[]> = <const>[
		'C',
		'G',
		'D',
		'A',
		'E',
		'B',
		'F#',
		'Gb',
		'Db',
		'C#',
		'Ab',
		'Eb',
		'Bb',
		'F',
	];

	/**
	 *
	 * @private
	 * @static
	 * @memberof Core#Key
	 */
	static ModesModulationProbabilities = <const>['0.165', '0.330', '0.495', '0.660', '0.825', '0.990', '1.000'];

	/**
	 *
	 * @private
	 * @static
	 * @memberof Core#Key
	 */
	static KeyModulationProbabilities = <const>[
		'0.200',
		'0.400',
		'0.520',
		'0.640',
		'0.720',
		'0.800',
		'0.857',
		'0.914',
		'0.957',
		'1.000',
	];

	get [Symbol.toStringTag](): string {
		return `Key <${this.modePositionRoman}>: ${this.pitches}`;
	}
}
