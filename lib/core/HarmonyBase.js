import { mapNotes } from '../utils/map';
import Note from './Note';
import NoteType from './types';

/**
 * The base class for harmonic structures
 *
 * @class HarmonyBase
 */
class HarmonyBase {
	/**
	 * Creates an instance of HarmonyBase.
	 * @constructor
	 *
	 * @param {Note} root
	 * @param {String} type
	 * @param {NoteType} noteType
	 */
	constructor(root, type, noteType) {
		if (root instanceof Note) {
			this._root = root.n;
		} else {
			this._root = root;
		}

		this._type = type;
		this._notes = [];
		this._noteType = noteType || NoteType.MIDI;
	}

	/**
	 * Gets the root note
	 *
	 * @type {String}
	 */
	get root() {
		return this._root;
	}

	/**
	 * Gets the notes
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
	 * Gets the type
	 *
	 * @type {String}
   	*/
	get type() {
		return this._type;
	}
}

export default HarmonyBase;
