import * as R from 'ramda';
import { HarmonyBase } from './HarmonyBase';
import { Note, NoteLike } from './Note';
import { ScaleIntervals, ScaleName } from '../constants/scales';
import { Interval, HarmonicPosition, Semitones } from '../constants/intervals';
import assignOctaves from '../utils/octaves';
import { PlayaError } from '../utils';
import { isUndefined } from '../utils/types-guards';
import { Octaves } from '../common/types';
import { NoteSymbol } from '../constants';

/**
 * Defines a Scale
 * @class
 * @memberof Core#
 *
 * @name Scale
 * @extends HarmonyBase
 */
export class Scale extends HarmonyBase {
	protected _intervals: ScaleIntervals | string;

	/**
	 * Scale names
	 *
	 * @member Names
	 * @memberof Core#Scale
	 * @enum
	 * @static
	 * @type {ScaleIntervals}
	 *
	 * @example Scale.Names.Major => "Major"
	 */
	static readonly Names = ScaleName;

	/**
	 * Scale intervals
	 *
	 * @member Intervals
	 * @memberof Core#Scale
	 * @enum
	 * @static
	 * @type {ScaleIntervals}
	 *
	 * @example Scale.Intervals.Major => "1P 2M 3M 4P 5P 6M 7M"
	 */
	static readonly Intervals = ScaleIntervals;

	constructor(root: NoteSymbol, intervals: ScaleIntervals | string, octaves?: Octaves);
	constructor(root: Note, intervals: ScaleIntervals | string, octaves?: Octaves);
	constructor(root: string, intervals: ScaleIntervals | string, octaves?: Octaves);
	constructor(root: number, intervals: ScaleIntervals | string, octaves?: Octaves);

	/**
	 * Creates an instance of Scale.
	 * @constructs Scale
	 * @memberof Core#
	 *
	 * @param {NoteLike} note A note
	 * @param {string} intervals the scale to create
	 * @param {Array<Number>} [octaves = [3, 1]] [starting, number of octaves] range of octaves to map notes to
	 *
	 * @example
	 * new Scale('A', Scale.Major) // default octaves [3, 1];
	 * new Scale('C3', ScaleIntervals.Minor); // will have "octaves" -> [3,1]
	 * new Scale('A', Scale.Intervals.MajorPentatonic, [4, 1]);
	 */
	constructor(note: NoteLike, intervals: ScaleIntervals | string, octaves?: Octaves) {
		super(note, octaves);

		this._intervals = intervals;

		this._notes = this.createScale() || [];

		this.assignOctaves();
	}

	/**
	 * Returns the scale's name
	 *
	 * @member name
	 * @memberof Core#Scale#
	 * @type {ScaleName|String}
	 */
	get name(): ScaleName | undefined {
		return Scale.getName(this._intervals);
	}

	/**
	 * Returns the scale's intervals
	 *
	 * @member intervals
	 * @memberof Core#Scale#
	 * @type {ScaleIntervals|String}
	 */
	get intervals(): ScaleIntervals | string {
		return this._intervals;
	}

	/**
	 * Note at position
	 * @example
	 * new Scale('A', Scale.MINOR).noteAt(5) => E
	 *
	 * @function noteAt
	 * @memberof Core#Scale#
	 * @param {HarmonicPosition} position
	 * @return {Note}
	 */
	noteAt(position: HarmonicPosition): Note {
		const intervals = this._intervals.split(' ').map((interv) => parseInt(interv.replace(/[^\d]/, '')));

		const noteIndex = intervals.indexOf(position);

		if (noteIndex === -1) {
			throw new PlayaError('Scale', `[${this._intervals}] structure doesn't contain interval: ${position}`);
		}

		return this.notes[noteIndex];
	}

	assignOctaves(octaves?: Octaves): this {
		if (octaves) {
			this._octaves = octaves;
		}

		this._notes = assignOctaves(this._notes, this.octaves, { type: 'scale', hasFlats: this.hasFlats });

		return this;
	}

	/**
	 * Creates a chromatic scale
	 *
	 * @param {String} rootNote
	 * @param {Boolean} withFlats
	 * @return {Array<Note>} Chromatic notes
	 * @private
	 */
	private createChromaticScale(rootNote: Note, withFlats?: boolean) {
		const chromaticNotes = [];

		let nextNote = rootNote;

		for (let index = -1; index < 12; index++) {
			let note = nextNote;

			if (note.isSharp && withFlats && note.e) {
				note = new Note(note.e);
			}

			nextNote = note.next;

			chromaticNotes.push(note);
		}

		return chromaticNotes;
	}

	/**
	 * Creates a scale
	 *
	 * @return {Array<Note>} The defined scale notes
	 * @private
	 */
	protected createScale(): Note[] {
		const baseSharpNotes = [];
		const baseFlatNotes = [];

		const rootNote = this.root;
		const scaleIntervals = this._intervals.split(' ');

		const chromaticSharpNotes = this.createChromaticScale(rootNote);
		const chromaticFlatNotes = this.createChromaticScale(rootNote, true);

		if (chromaticSharpNotes.length === scaleIntervals.length) {
			return chromaticSharpNotes;
		}

		for (let index = 0; index < scaleIntervals.length; index++) {
			const interval = scaleIntervals[index] as Interval;
			const semit = Semitones[interval];

			if (semit != null && semit < chromaticSharpNotes.length) {
				baseSharpNotes[index] = chromaticSharpNotes[semit];
			}
		}

		for (let index = 0; index < scaleIntervals.length; index++) {
			const interval = scaleIntervals[index] as Interval;
			const semit = Semitones[interval];

			if (semit != null && semit < chromaticFlatNotes.length) {
				baseFlatNotes[index] = chromaticFlatNotes[semit];
			}
		}

		// This is to figure out if flats is a better match than sharps when the root note is natural
		const naturalNotesLenSharp = R.length(R.uniqBy((note) => Note.stripAccidental(note), baseSharpNotes));
		const naturalNotesLenFlat = R.length(R.uniqBy((note) => Note.stripAccidental(note), baseFlatNotes));

		if (rootNote.isFlat) {
			this._hasFlats = true;
			this._hasSharps = false;

			return baseFlatNotes;
		}

		if (rootNote.isSharp) {
			this._hasSharps = true;
			this._hasFlats = false;

			return baseSharpNotes;
		}

		// TODO: refactor this since this preference for sharps is not justifiable
		if (naturalNotesLenSharp >= naturalNotesLenFlat) {
			this._hasSharps = true;
			this._hasFlats = false;

			return baseSharpNotes;
		} else {
			this._hasFlats = true;
			this._hasSharps = false;

			return baseFlatNotes;
		}
	}

	/**
	 * Finds the name of the set of intervals if it exists in our collection
	 * @function getName
	 * @memberof Core#Scale
	 *
	 * @static
	 * @param {(ScaleIntervals | string)} intervals
	 * @return {(ScaleName | undefined)}
	 */
	static getName(intervals: ScaleIntervals | string): ScaleName | undefined {
		const isInterval = R.compose(R.equals(intervals), R.last);

		const name = <[ScaleName, ScaleIntervals]>R.find(isInterval, Object.entries(ScaleIntervals));

		if (isUndefined(name)) {
			return;
		}

		return R.head(name) as ScaleName;
	}

	/**
	 * Lydian scale intervals
	 * @member Lydian
	 * @memberof Core#Scale
	 * @type {ScaleIntervals}
	 * @enum
	 * @static
	 * @readonly
	 */
	static readonly Lydian = ScaleIntervals.Lydian;

	/**
	 * Major scale intervals
	 * @member Major
	 * @memberof Core#Scale
	 * @type {ScaleIntervals}
	 * @enum
	 * @static
	 * @readonly
	 */
	static readonly Major = ScaleIntervals.Major;

	/**
	 * Ionian scale intervals
	 * @member Ionian
	 * @memberof Core#Scale
	 * @type {ScaleIntervals}
	 * @enum
	 * @static
	 * @readonly
	 */
	static readonly Ionian = ScaleIntervals.Ionian;

	/**
	 * Mixolydian scale intervals
	 * @member Mixolydian
	 * @memberof Core#Scale
	 * @type {ScaleIntervals}
	 * @enum
	 * @static
	 * @readonly
	 */
	static readonly Mixolydian = ScaleIntervals.Mixolydian;

	/**
	 * Minor scale intervals
	 * @member Minor
	 * @memberof Core#Scale
	 * @type {ScaleIntervals}
	 * @enum
	 * @static
	 * @readonly
	 */
	static readonly Minor = ScaleIntervals.Minor;

	/**
	 * Aeolian scale intervals
	 * @member Aeolian
	 * @memberof Core#Scale
	 * @type {ScaleIntervals}
	 * @enum
	 * @static
	 * @readonly
	 */
	static readonly Aeolian = ScaleIntervals.Aeolian;

	/**
	 * Dorian scale intervals
	 * @member Dorian
	 * @memberof Core#Scale
	 * @type {ScaleIntervals}
	 * @enum
	 * @static
	 * @readonly
	 */
	static readonly Dorian = ScaleIntervals.Dorian;

	/**
	 * Phrygian scale intervals
	 * @member Phrygian
	 * @memberof Core#Scale
	 * @type {ScaleIntervals}
	 * @enum
	 * @static
	 * @readonly
	 */
	static readonly Phrygian = ScaleIntervals.Phrygian;

	/**
	 * Locrian scale intervals
	 * @member Locrian
	 * @memberof Core#Scale
	 * @type {ScaleIntervals}
	 * @enum
	 * @static
	 * @readonly
	 */
	static readonly Locrian = ScaleIntervals.Locrian;

	get [Symbol.toStringTag](): string {
		return `Scale: ${this.pitches}`;
	}
}
