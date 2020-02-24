import * as R from 'ramda';
import { mapNotes } from '../utils/map';
import Note from './Note';
import NoteType from './types';
import assignOctaves from '../utils/octaves';

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
	 * @param {Array<Number>} octaves [starting, number of octaves] range of octaves to map notes to
	 * @param {string} instanceType 'scale' or 'chord'
	 */
	constructor(root, type, octaves, instanceType) {
		if (root instanceof Note) {
			this._root = root.n;
		} else {
			this._root = root;
		}

		this._octaves = octaves;
		this._type = type;
		// TODO: remove instance type
		this._instanceType = instanceType;
		this._notes = [];
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
		return this._notes;
	}

	/**
	 * Gets the notes as string
	 * @member notes
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<NoteType.STR>}
	 */
	get string() {
		const notes = this._notes;

		if (!notes.length) {
			return [];
		}

		return mapNotes(notes, NoteType.STR);
	}

	/**
	 * Gets the notes as midi
	 * @member notes
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<NoteType.STR>}
	 */
	get midi() {
		if (!this._notes.length) {
			return [];
		}

		return mapNotes(this._notes, NoteType.MIDI);
	}

	/**
	 * Gets the notes as frequencies
	 * @member notes
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<NoteType.STR>}
	 */
	get freq() {
		if (!this._notes.length) {
			return [];
		}

		return mapNotes(this._notes, NoteType.FREQ);
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


	/**
	* Octaves
	* @private
	* @type {Array<Number>}
	*/
	get octaves() {
		return this._octaves;
	}

	/**
	 * Sets the octaves and assigns them to the notes
	 * @member {Array<Number>} octaves
	 * @memberof Core.HarmonyBase#
	 * @param {Array} octaves
	 */
	set octaves(octaves) {
		if (octaves !== this._octaves) {
			this.assignOctaves(octaves);
		}
	}

	/**
	 * Assigns a new octave range - [ 3, 1 ]
	 * @function assignOctaves
	 * @memberof Core.HarmonyBase#
	 *
	 * @param {Array<Number>} octaves
	 */
	assignOctaves(octaves) {
		if (octaves) {
			this._octaves = octaves;
		}

		let notes = this._notes;

		if (this._instanceType === 'chord') {
			notes = R.uniqBy(R.prop('note'), this._notes);
		}

		this._notes = assignOctaves(notes, this.octaves, { type: this._instanceType, hasFlats: this.hasFlats });
	}
}

export default HarmonyBase;
