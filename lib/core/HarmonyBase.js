import { mapNotes } from '../utils/map';
import Note from './Note';
import NoteType from './types';

/**
 * The base class for harmonic structures
 * @class
 * @memberof Core
 *
 * @name HarmonyBase
 */
class HarmonyBase {
	/**
	 * Creates an instance of HarmonyBase.
	 * @constructor
	 * @memberof Core
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
	 * @member root
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {String}
	 */
	get root() {
		return this._root;
	}

	/**
	 * Gets the notes
	 * @member notes
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<Note>}
	 */
	get notes() {
		const notes = this._notes;
		const noteType = this._noteType;

		if (!notes.length) {
			return null;
		}

		return mapNotes(notes, noteType);
	}

	/**
	 * Gets the type
	 * @member type
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {String}
   	*/
	get type() {
		return this._type;
	}
}

export default HarmonyBase;
