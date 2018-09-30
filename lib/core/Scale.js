import HarmonyBase from './HarmonyBase';
import Note from './Note';
import { SCALES } from './constants';
import assignOctaves from '../utils/assignOctaves';
import { interval as intervalTool } from '../tools';
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

		this._intervals = SCALES[type];
		this._octaves = octaves || [ 4, 1 ];

		if (!this._intervals) {
			throw new Error('That scale is not defined! Try another one.');
		}

		this._notes = this._createScale() || [];

		if (this._noteType === NoteType.MIDI || this._noteType === NoteType.FREQ) {
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

Scale.CHROMATIC = 'CHROMATIC';
Scale.LYDIAN = 'LYDIAN';
Scale.MAJOR = 'MAJOR';
Scale.IONIAN = 'IONIAN';
Scale.MIXOLYDIAN = 'MIXOLYDIAN';
Scale.MINOR = 'MINOR';
Scale.AEOLIAN = 'AEOLIAN';
Scale.DORIAN = 'DORIAN';
Scale.PHRYGIAN = 'PHRYGIAN';
Scale.LOCRIAN = 'LOCRIAN';
Scale.MAJOR_PENTATONIC = 'MAJOR_PENTATONIC';
Scale.MINOR_PENTATONIC = 'MINOR_PENTATONIC';
Scale.EGYPTIAN = 'EGYPTIAN';
Scale.MELODIC_MINOR = 'MELODIC_MINOR';
Scale.ALTERED = 'ALTERED';
Scale.HARMONIC_MINOR = 'HARMONIC_MINOR';

export default Scale;
