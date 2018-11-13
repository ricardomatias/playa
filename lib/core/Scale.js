import HarmonyBase from './HarmonyBase';
import Note from './Note';
import { SCALES, CHROMATIC_SCALE } from '../constants';
import assignOctaves from '../utils/assignOctaves';
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

		this._intervals = type;

		this._octaves = octaves || [ 4, 1 ];

		if (!this._intervals) {
			throw new Error('That scale is not defined! Try another one.');
		}

		this._notes = this._createScale() || [];

		const isMidiOrFreq = this._noteType === NoteType.MIDI || this._noteType === NoteType.FREQ;

		// Assign octaves for MIDI, FREQ and if requested by argument
		if (octaves || isMidiOrFreq) {
			this._notes = assignOctaves(this._notes, this._octaves, 'scale');
		}
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

			if (note.isSharp() &&
				(rootNote.isFlat() || withFlats)) {
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
		const notes = [];

		const rootNote = new Note(this._root);
		const scaleIntervals = this._intervals.split(' ');

		const chromaticNotes = this._createChromaticScale(rootNote);

		if (chromaticNotes.length === this._intervals.length) {
			return chromaticNotes;
		}

		for (let index = 0; index < scaleIntervals.length; index++) {
			const interval = scaleIntervals[index];
			const semitones = intervalTool.semitones(interval);

			if (semitones < chromaticNotes.length) {
				notes[index] = chromaticNotes[semitones];
			}
		}

		return notes;
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
