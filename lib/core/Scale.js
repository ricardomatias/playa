import Note from './Note';
import { SCALES, INTERVALS } from './constants';
import { mapNotes } from '../utils/map';
import assignOctaves from '../utils/assignOctaves';
import NoteType from './types';

/**
 * Defines a Scale
 * @typedef {Object} Scale
 *
 * @class Scale
 */
class Scale {
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
		if (note instanceof Note) {
			this._root = note.n;
		} else {
			this._root = note;
		}

		this._noteType = noteType || NoteType.MIDI;
		this._octaves = octaves || [ 4, 1 ];
		this._type = type;
		this._intervals = SCALES[type];

		if (!this._intervals) {
			throw new Error('That scale is not defined! Try another one.');
		}

		this._notes = this._createScale() || [];

		if (this._noteType === NoteType.MIDI || this._noteType === NoteType.FREQ) {
			this._notes = assignOctaves(this._notes, this._octaves, 'scale');
		}
	}

	/**
	 * Gets the root note of the scale
	 *
	 * @type {String}
	 */
	get root() {
		return this._root;
	}

	/**
	 * Gets the type of the scale
	 *
	 * @type {String}
   	*/
	get type() {
		return this._type;
	}

	/**
	 * Gets the notes of the scale
	 *
	 * @type {Array<Note>}
	 */
	get notes() {
		let notes = this._notes;
		const noteType = this._noteType;

		if (!notes.length) {
			return null;
		}

		return mapNotes(notes, noteType);
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

		if (!scaleIntervals.length) {
			console.log('No intervals, no fun, sorry!'); /* eslint no-console: 0 */
			return [];
		}

		const chromaticNotes = this._createChromaticScale(rootNote);

		if (chromaticNotes.length === this._intervals.length) {
			return chromaticNotes;
		}

		for (let index = 0; index < scaleIntervals.length; index++) {
			const interval = scaleIntervals[index];
			const intervalValue = INTERVALS.get(interval);

			if (intervalValue < chromaticNotes.length) {
				notes[index] = chromaticNotes[intervalValue];
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
