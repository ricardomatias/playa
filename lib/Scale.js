const Note = require('./Note');
const getInterval = require('./Interval');
const SCALES = require('./scales');
const { notesToString } = require('./utils');

class Scale {
	constructor(note, type) {
		if (note instanceof Note) {
			this._root = note.n;
		} else {
			this._root = note;
		}

		this._type = type;
		this._intervals = SCALES[type];
		this._notes = this._createScale() || [];
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
		const notes = this._notes;

		if (!notes.length) {
			return null;
		}

		return this._notes;
	}

	/**
   * Gets the notes of the scale
	 *
   * @type {Array<String>}
   */
	get notesStr() {
		return notesToString(this._notes);
	}

	/**
 	 * Creates based on a given root and scale.
 	 *
	 * @return {Array<Note>} Array of the Key notes mapped to octaves
 	 */
	mapScaleOctaves() {
		const notes = this.notesStr;
		const firstScaleNote = new Note(notes[0]);
		const chromaticNotes = this._createChromaticScale(new Note('C'), firstScaleNote.isFlat());
		const map = [];

		const allMidiNotes = [];
		let chromaticIndex = 0;

		if (!notes.length) {
			return;
		}

		// Just push the first
		allMidiNotes.push(new Note('C', 0));

		for (let midi = 1; midi < 128; midi++) {
			chromaticIndex = midi % 12;

			const chromaticNote = chromaticNotes[chromaticIndex];

			allMidiNotes.push(new Note(chromaticNote.n, midi));
		}

		let scaleIndex = 0;

		allMidiNotes.forEach(note => {
			const chromaticNote = note.n;
			const midi = note.m;

			if (chromaticNote === notes[scaleIndex]) {
				const scaleNote = new Note(chromaticNote, midi);

				map.push(scaleNote.noct);

				scaleIndex++;

				if (scaleIndex > notes.length - 1) {
					scaleIndex = 0;
				}
			}
		});

		return map;
	}

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

	_createScale() {
		const notes = [];

		const rootNote = new Note(this._root);
		const scaleIntervals = this._intervals.split(' ');

		if (!scaleIntervals.length) {
			console.log('No intervals, no fun, sorry!');
			return [];
		}

		const chromaticNotes = this._createChromaticScale(rootNote);

		if (chromaticNotes.length === this._intervals.length) {
			return chromaticNotes;
		}

		for (let index = 0; index < scaleIntervals.length; index++) {
			const interval = scaleIntervals[index];
			const intervalValue = getInterval(interval);

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

module.exports = Scale;
