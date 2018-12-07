import * as R from 'ramda';
import HarmonyBase from './HarmonyBase';
import Note from './Note';
import { CHORDS, CHORD_INTERVALS, CHORD_TYPES, CHORD_STRUCTURES } from '../constants';
import { deconstructName } from '../utils/chord';
import assignOctaves from '../utils/assignOctaves';
import whilst from '../utils/whilst';
import { distance } from '../tools';
import NoteType from './types';

/**
 * Defines a chord
 * @typedef {Object} Chord
 *
 * @class Chord
 */
class Chord extends HarmonyBase {
	/**
	 * Creates an instance of Chord.
	 * @constructor
	 *
	 * @param {String|Object} chord - a chord name f.ex: 'Am7'
	 * @param {Object} [chord.root] - f.ex: A
	 * @param {Object} [chord.scale] - f.ex: '1P 2M 3m 4P 5P 6m 7m'
	 * @param {Object} [chord.structure] - f.ex: triad
	 * @param {Object} [opts] - chord options
	 * @param {NoteType} [opts.noteType] - the note type in the chord
	 * @param {Array<Number>} [opts.octaves] [starting, number of octaves] range of octaves to map notes to
	 */
	constructor(chord, { noteType, octaves } = {}) {
		let chordName = chord;
		const isChordName = R.is(String, chord);

		let {
			root,
			type,
			structure,
		} = isChordName ? deconstructName(chordName) : chord;

		// !THIS NEEDS TO BE CALLED HERE
		super(root, type, noteType);

		this._type = type;
		this._chordName = chordName;
		this._octaves = octaves || [ 4, 1 ];

		if (this._root && this._type) {
			if (R.is(String, chord)) {
				this._notes = this._createChord();
			} else {
				this._notes = this._createChordByStructure(structure);
			}
		}

		if (!this._notes) {
			return;
		}

		const isMidiOrFreq = this._noteType === NoteType.MIDI || this._noteType === NoteType.FREQ;

		// Assign octaves for MIDI, FREQ and if requested by argument
		if (octaves || isMidiOrFreq) {
			this._notes = assignOctaves(this._notes, this._octaves, 'chord');
		}
	}

	/**
	* Returns the chord's name
	*
   * @type {String}
	*/
	get name() {
		return this._chordName;
	}

	/**
	 * Creates a chord based on a chordName f.ex: Am7
	 *
	 * @param {String} chordName
	 * @return {Array<Note>}
	 * @memberof Chord
	 */
	_createChord() {
		const root = this._root;
		const type = this._type;

		const chord = CHORD_INTERVALS.get(type)[0];
		const intervals = chord.split(' ');

		const notes = [ new Note(root) ];

		for (let idx = 1; idx < intervals.length; idx++) {
			const interval = intervals[idx];

			const note = distance.transposeUp(root, interval);

			notes.push(new Note(note));
		}

		return notes;
	}

	/**
	 * Creates a chord based on a chordName f.ex: Am7
	 *
	 * @param {String} structure
	 * @return {Array<Note>}
	 * @memberof Chord
	 */
	_createChordByStructure(structure = Chord.TRIAD) {
		const root = this._root;
		const scale = this._type.split(' ');
		const [ nrOfNotes, defaultStructIntervals ] = structure;
		let intervals = defaultStructIntervals.split(' ');

		let chordIntervals = this._createFromScale(scale, nrOfNotes, intervals);

		if (chordIntervals.length !== nrOfNotes) {
			chordIntervals = this._createFromStructure(structure, scale);
		}

		if (!chordIntervals) {
			return [];
		}

		const notes = [ new Note(root) ];

		for (let idx = 1; idx < chordIntervals.length; idx++) {
			const interval = chordIntervals[idx];

			const note = distance.transposeUp(root, interval);

			notes.push(new Note(note));
		}

		const chord = chordIntervals.join(' ');

		this._type = Chord.findChordName(chord);

		this._chordName = `${root}${this._type}`;

		return notes;
	}

	_createFromScale(scale, nrOfNotes, intervals) {
		const chordIntervals = [];

		for (let index = 0; index < nrOfNotes; index++) {
			const dist = intervals[index];
			let interval = R.find(R.includes(dist), scale);

			if (!interval) {
				interval = R.find(R.includes(dist - 7), scale);

				if (!interval) {
					continue;
				}

				interval = interval.replace(/\d/, dist);
			}

			chordIntervals.push(interval);
		}

		return chordIntervals;
	}

	// TODO: MAKE THE TYPE CHOICE RANDOM
	_createFromStructure(structure, scale) {
		const types = CHORD_TYPES.get(structure);
		const [ nrOfNotes ] = structure;
		let chordIntervals;

		for (let index = 0; index < types.length; index++) {
			const chordType = types[index];
			const chord = CHORD_INTERVALS.get(chordType)[0];

			chordIntervals = this._createFromScale(scale, nrOfNotes, chord.split(' '));

			if (chordIntervals.length === nrOfNotes) {
				break;
			} else {
				chordIntervals = null;
			}
		}

		return chordIntervals;
	}

	static findChordName(chord) {
		let chordType;

		for (const [ name, type ] of CHORD_INTERVALS.entries()) {
			if (chordType) { // this is so we don't get the empty major
				break;
			}

			if (R.head(type) === chord) {
				chordType = name;
			}
		}

		if (!chordType) {
			let intervals = chord.split(' ');
			const last = R.last(intervals);

			try {
				whilst(() => {
					intervals = R.take(intervals.length - 1, intervals);
					let tempChord = intervals.join(' ');

					for (const [ name, type ] of CHORD_INTERVALS.entries()) {
						if (R.head(type) === tempChord) {
							chordType = name;
						}
					}
				}, () => (!chordType));

				chordType = `${chordType}add${last.replace(/\D/g, '')}`;
			} catch (error) {
				return '';
			}
		}

		return chordType;
	}
}

Chord.CHORDS = CHORDS;

/**
 * @example Chord.MAJOR_SIX_ADD_NINE = '6add9';
 */
for (const [ name, chord ] of CHORDS.entries()) {
	Chord[name] = chord;
}

Chord.STRUCTURES = CHORD_STRUCTURES;

/**
 * @example Chord.TRIAD = 'triad';
 */
for (const [ name, structure ] of CHORD_STRUCTURES.entries()) {
	Chord[name] = structure;
}
/**
 * @example Chord.TYPES.get(Chord.TRIAD) = MAJOR_CHORD, MINOR_CHORD, ...;
 */
Chord.TYPES = CHORD_TYPES;

export default Chord;
