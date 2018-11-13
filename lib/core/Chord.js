import HarmonyBase from './HarmonyBase';
import Scale from './Scale';
import { CHORDS, CHORDS_INTERVALS } from '../constants';
import assignOctaves from '../utils/assignOctaves';
import { interval as intervalTool } from '../tools';
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
	 * @param {String} chordName - a chord name f.ex: 'Am7'
	 * @param {Object} [opts] - chord options
	 * @param {NoteType} [opts.noteType] - the note type in the chord
	 * @param {Array<Number>} [opts.octaves] [starting, number of octaves] range of octaves to map notes to
	 */
	constructor(chordName, { noteType, octaves } = {}) {
		const separators = {
			root: /(?:[A-G](#|b)?){0,2}/, // NOTE
			type: /M|m|aug|dim|5|sus2|sus4/, // type
			extensions: /.*/,
		};

		let root;
		let type;
		let chord = chordName;
		let extensions = [];

		for (const sep in separators) {
			if (!{}.hasOwnProperty.call(separators, sep)) {
				continue;
			}

			const reg = new RegExp(separators[sep]);

			let result = chord.match(reg);

			if (!result && sep === 'type') {
				result = [ 'M' ]; // ASSUME IT'S MAJOR
			} else if (!result) {
				continue;
			}

			chord = chord.replace(reg, '');

			switch (sep) {
			case 'root':
				root = result[0];
				break;
			case 'type':
				type = result[0];
				break;
			case 'extensions':
				extensions = extensions.concat(result);
				break;
			default:
				break;
			}
		}

		// THIS NEEDS TO COME HERE
		super(root, type, noteType);

		this._type = type;
		this._chordName = chordName;
		this._extensions = extensions;
		this._octaves = octaves || [ 4, 1 ];

		if (this._root && this._type) {
			this._notes = this._createChord(chordName);
		}

		const isMidiOrFreq = this._noteType === NoteType.MIDI || this._noteType === NoteType.FREQ;

		// Assign octaves for MIDI, FREQ and if requested by argument
		if (octaves || isMidiOrFreq) {
			this._notes = assignOctaves(this._notes, this._octaves, 'chord');
		}
	}

	/**
   * Returns the chord's extensions
   *
   * @type {Array<String>}
   */
	get ext() {
		return this._extensions;
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
	_createChord(chordName) {
		const root = this._root;
		const chromaticScale = new Scale(root, Scale.CHROMATIC, { noteType: NoteType.NOTE });
		const chromaticNotes = chromaticScale.notes;
		const chromaLen = chromaticNotes.length;
		const notes = [];

		const chordType = chordName.replace(root, '');

		const chord = CHORDS_INTERVALS.get(chordType)[0];
		const intervals = chord.split(' ');

		for (let idx = 0; idx < intervals.length; idx++) {
			const interval = intervals[idx];
			let semitones = intervalTool.semitones(interval);

			if (semitones > chromaLen - 1) {
				semitones -= chromaLen;
			}

			const note = chromaticNotes[semitones];

			if (note) {
				notes.push(note);
			}
		}

		return notes;
	}
}

Chord.CHORDS = CHORDS;

/**
 * @example Chord.MAJOR_SIX_ADD_NINE = '6add9';
 */
for (const [ name, chord ] of CHORDS.entries()) {
	Chord[name] = chord;
}

export default Chord;
