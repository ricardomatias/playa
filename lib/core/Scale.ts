import * as R from 'ramda';
import HarmonyBase from './HarmonyBase';
import { Note } from './Note';
import { Interval, NoteSymbol, Semitones, ScaleIntervals, ScaleName } from '../constants';
import assignOctaves from '../utils/octaves';
import { natural } from '../utils/note';
import { PlayaError } from '../utils';
import { isUndefined } from '../utils/types-guards';
import { Octaves } from '../common/types';

/**
 * Defines a Scale
 * @class
 * @memberof Core#
 *
 * @name Scale
 * @extends HarmonyBase
 */
export class Scale extends HarmonyBase {
	protected _intervals: ScaleIntervals | string
	/**
	 * Creates an instance of Scale.
	 * @constructs Scale
	 * @memberof Core#
	 *
	 * @param {Note|NoteSymbol|string} note A note
	 * @param {string} intervals the scale to create
	 * @param {Array<Number>} [octaves = [3, 1]] [starting, number of octaves] range of octaves to map notes to
	 */
	constructor(note: Note | NoteSymbol | string, intervals: ScaleIntervals | string, octaves: Octaves = [ 3, 1 ]) {
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
	 * Note at interval
	 * @example
	 * new Scale('A', Scale.MINOR).noteAt(5) => E
	 *
	 * @function noteAt
	 * @memberof Core#Scale#
	 * @param {number} interval
	 * @return {Note}
	 */
	noteAt(interval: number): Note {
		const intervals = this._intervals.split(' ').map((interv) => parseInt(interv.replace(/[^\d]/, '')));

		const noteIndex = intervals.indexOf(interval);

		if (noteIndex === -1) {
			throw new PlayaError('Scale', `[${this._intervals}] structure doesn't contain interval: ${interval}`);
		}

		return this.notes[noteIndex];
	}

	assignOctaves(octaves?: Octaves): void {
		if (octaves) {
			this._octaves = octaves;
		}

		this._notes = assignOctaves(this._notes, this.octaves, { type: 'scale', hasFlats: this.hasFlats });
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

		const rootNote = new Note(this.root);
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
		const naturalNotesLenSharp = R.length(R.uniqBy((note) => natural(note), baseSharpNotes));
		const naturalNotesLenFlat = R.length(R.uniqBy((note) => natural(note), baseFlatNotes));

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
	 * Finds the name of the set of intervals if it exists in our
	 * @function getName
	 * @memberof Core#Scale
	 *
	 * @static
	 * @param {(ScaleIntervals | string)} intervals
	 * @return {(ScaleName | undefined)}
	 */
	static getName(intervals: ScaleIntervals | string): ScaleName | undefined {
		const isInterval = R.compose(
			R.equals(intervals),
			R.last,
		);

		const name = <[ScaleName, ScaleIntervals]>R.find(isInterval, Object.entries(ScaleIntervals));

		if (isUndefined(name)) {
			return;
		}

		return R.head(name) as ScaleName;
	}

	static readonly Names = ScaleName;

	static readonly Lydian: ScaleIntervals = ScaleIntervals.Lydian;
	static readonly Major: ScaleIntervals = ScaleIntervals.Major;
	static readonly Ionian: ScaleIntervals = ScaleIntervals.Ionian;
	static readonly Mixolydian: ScaleIntervals = ScaleIntervals.Mixolydian;
	static readonly Minor: ScaleIntervals = ScaleIntervals.Minor;
	static readonly Aeolian: ScaleIntervals = ScaleIntervals.Aeolian;
	static readonly Dorian: ScaleIntervals = ScaleIntervals.Dorian;
	static readonly Phrygian: ScaleIntervals = ScaleIntervals.Phrygian;
	static readonly Locrian: ScaleIntervals = ScaleIntervals.Locrian;
	static readonly MajorPentatonic: ScaleIntervals = ScaleIntervals.MajorPentatonic;
	static readonly MinorPentatonic: ScaleIntervals = ScaleIntervals.MinorPentatonic;
	static readonly Egyptian: ScaleIntervals = ScaleIntervals.Egyptian;
	static readonly MelodicMinor: ScaleIntervals = ScaleIntervals.MelodicMinor;
	static readonly Altered: ScaleIntervals = ScaleIntervals.Altered;
	static readonly HarmonicMinor: ScaleIntervals = ScaleIntervals.HarmonicMinor;
	static readonly Chromatic: ScaleIntervals = ScaleIntervals.Chromatic;
}
