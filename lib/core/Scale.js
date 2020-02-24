import * as R from 'ramda';
import HarmonyBase from './HarmonyBase';
import Note from './Note';
import { SCALES, CHROMATIC_SCALE } from '../constants';
import { natural } from '../utils/note';
import intervalTool from '../tools/interval';

/**
 * Defines a Scale
 * @class
 * @memberof Core
 *
 * @name Scale
 * @extends HarmonyBase
 */
class Scale extends HarmonyBase {
	/**
	 * Creates an instance of Scale.
	 * @constructor
	 * @memberof Core
	 *
	 * @param {Note|String} note A note
	 * @param {String} type the type of scale to create
	 * @param {Array<Number>} [octaves] [starting, number of octaves] range of octaves to map notes to
	 */
	constructor(note, type, octaves = [ 3, 1 ]) {
		super(note, type, octaves, 'scale');

		this._hasFlats = false;
		this._hasSharps = false;

		if (!type) {
			throw new Error('That scale is not defined! Try another one.');
		}

		this._notes = this._createScale() || [];

		this.assignOctaves();
	}

	/**
	* Is the note a flat
	* @function hasFlats
	* @memberof Core.Scale#
	*
	* @return {Boolean} Returns if it's a flat
	*/
	get hasFlats() {
		return this._hasFlats;
	}

	/**
	* Is the note a flat
	* @function hasSharps
	* @memberof Core.Scale#
	*
	* @return {Boolean} Returns if it's a flat
	*/
	get hasSharps() {
		return this._hasSharps;
	}

	/**
	 * Creates a chromatic scale
	 *
	 * @param {String} rootNote
	 * @param {Boolean} withFlats
	 * @return {Array<Note>} Chromatic notes
	 * @private
	 */
	_createChromaticScale(rootNote, withFlats) {
		const chromaticNotes = [];

		let nextNote = rootNote;

		for (let index = -1; index < 12; index++) {
			let note = nextNote;

			if (note.isSharp &&
				withFlats) {
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
	_createScale() {
		const baseSharpNotes = [];
		const baseFlatNotes = [];

		const rootNote = new Note(this._root);
		const rootEnh = new Note(rootNote.e);
		const scaleIntervals = this._type.split(' ');

		const chromaticSharpNotes = this._createChromaticScale(rootNote.isFlat ? rootEnh : rootNote);
		const chromaticFlatNotes = this._createChromaticScale(rootNote.isSharp ? rootEnh : rootNote, true);

		if (chromaticSharpNotes.length === scaleIntervals.length) {
			return chromaticSharpNotes;
		}

		for (let index = 0; index < scaleIntervals.length; index++) {
			const interval = scaleIntervals[index];
			const semitones = intervalTool.semitones(interval);

			if (semitones < chromaticSharpNotes.length) {
				baseSharpNotes[index] = chromaticSharpNotes[semitones];
			}
		}

		for (let index = 0; index < scaleIntervals.length; index++) {
			const interval = scaleIntervals[index];
			const semitones = intervalTool.semitones(interval);

			if (semitones < chromaticFlatNotes.length) {
				baseFlatNotes[index] = chromaticFlatNotes[semitones];
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
}

Scale.SCALES = SCALES;
Scale.NAMES = {};

/**
 * @example Scale.EGYPTIAN = '1P 2M 4P 5P 7m';
 */
for (const [ name, scale ] of SCALES.entries()) {
	Scale[name] = scale;
	Scale.NAMES[scale] = name;
}

// Special treatment
Scale.CHROMATIC = CHROMATIC_SCALE;

export default Scale;
