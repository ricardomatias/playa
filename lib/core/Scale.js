import * as R from 'ramda';
import HarmonyBase from './HarmonyBase';
import Note from './Note';
import { SCALES, CHROMATIC_SCALE } from '../constants';
import assignOctaves from '../utils/assignOctaves';
import { natural } from '../utils/note';
import intervalTool from '../tools/interval';
import NoteType from './types';

/**
 * Defines a Scale
 * @typedef {Object} Scale
 *
 * @class Scale
 */
class Scale extends HarmonyBase {
	/**
	 * Creates an instance of Scale.
	 * @param {Note|String} note A note
	 * @param {String} type the type of scale to create
	 * @param {Object} [opts]
	 * @param {String} [opts.noteType] the note's value type
	 * @param {Array<Number>} [opts.octaves] [starting, number of octaves] range of octaves to map notes to
	 * @memberof Scale
	 */
	constructor(note, type, { noteType, octaves } = {}) {
		super(note, type, noteType);

		this._octaves = octaves || [ 4, 1 ];

		if (!type) {
			throw new Error('That scale is not defined! Try another one.');
		}

		this._notes = this._createScale() || [];

		const isMidiOrFreq = this._noteType === NoteType.MIDI || this._noteType === NoteType.FREQ;

		// Assign octaves for MIDI, FREQ and if requested by argument
		if (octaves || isMidiOrFreq) {
			this._notes = assignOctaves(this._notes, this._octaves, { type: 'scale', hasFlats: this.hasFlats });
		}
	}

	/**
	* Is the note a flat
	*
	* @memberof Note
	* @return {Boolean} Returns if it's a flat
	*/
	get hasFlats() {
		return this._accident === Note.FLAT;
	}

	/**
	* Is the note a flat
	*
	* @memberof Note
	* @return {Boolean} Returns if it's a flat
	*/
	get hasSharps() {
		return this._accident === Note.FLAT;
	}

	/**
	 * Creates a chromatic scale
	 *
	 * @param {String} rootNote
	 * @param {Boolean} withFlats
	 * @return {Array<Note>} Chromatic notes
	 * @memberof Scale
	 */
	_createChromaticScale(rootNote, withFlats) {
		const chromaticNotes = [];

		let nextNote = rootNote;

		for (let index = -1; index < 12; index++) {
			let note = nextNote;

			if (note.isSharp &&
				(withFlats)) {
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
	 * @memberof Scale
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
		const naturalNotesLenSharp = R.length(R.uniqBy((note) => natural(note.n), baseSharpNotes));
		const naturalNotesLenFlat = R.length(R.uniqBy((note) => natural(note.n), baseFlatNotes));

		if (rootNote.isFlat) {
			return baseFlatNotes;
		}

		if (rootNote.isSharp) {
			return baseSharpNotes;
		}

		// TODO: refactor this since this preference for sharps is not justifiable
		if (naturalNotesLenSharp >= naturalNotesLenFlat) {
			this._accident = '#';

			return baseSharpNotes;
		} else {
			this._accident = 'b';

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