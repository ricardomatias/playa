import * as R from 'ramda';
import { mapNotes } from '../utils/map';
import Note from './Note';
import { NoteType } from './note-type';
import assignOctaves from '../utils/octaves';

/**
 * The base class for harmonic structures
 *
 * @memberof Core
 * @class
 * @name HarmonyBase
 */
class HarmonyBase {
	/**
	 * Creates an instance of HarmonyBase.
	 *
	 * @constructs HarmonyBase
	 * @memberof Core.HarmonyBase#
	 * @private
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
		this._hasFlats = false;
		this._hasSharps = false;
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
	 * Gets the notes in {@link Core#Note} format
	 * @member notes
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<Core#Note>}
	 */
	get notes() {
		return this._notes;
	}

	/**
	 * Gets the notes as string
	 * @example
	 * new Scale('C', Scale.MAJOR).string => [ 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3' ]
	 * new Chord('Cmaj').string => [ 'C3', 'E3', 'G3' ]
	 *
	 * @member string
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<string>}
	 */
	get string() {
		const notes = this._notes;

		if (!notes.length) {
			return [];
		}

		return mapNotes(notes, NoteType.STR);
	}

	/**
	 * Gets the notes in midi format
	 * @example
	 * new Scale('C', Scale.MAJOR).midi => [ 60, 62, 64, 65, 67, 69, 71 ]
	 * new Chord('Cmaj').midi => [ 60, 64, 67 ]
	 *
	 * @member midi
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<number>}
	 */
	get midi() {
		if (!this._notes.length) {
			return [];
		}

		return mapNotes(this._notes, NoteType.MIDI);
	}

	/**
	 * Gets the notes as frequencies
	 * @example
	 * new Scale('C', Scale.MAJOR).freq => [ 261.62, 293.66, 329.62, 349.22, 391.99, 440, 493.88 ]
	 * new Chord('Cmaj').freq => [261.62, 329.62, 391.99]
	 *
	 * @member freq
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<number>}
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

	get octaves() {
		return this._octaves;
	}

	/**
	 * Octaves getter/setter
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
	* Does it use flats
	* @member hasFlats
	* @memberof Core.HarmonyBase#
	*
	* @type {boolean}
	*/
	get hasFlats() {
		return this._hasFlats;
	}

	/**
	* Does it use sharps
	* @member hasSharps
	* @memberof Core.HarmonyBase#
	*
	* @type {boolean}
	*/
	get hasSharps() {
		return this._hasSharps;
	}

	/**
	 * Assigns a new octave range - [ 3, 1 ]
	 *
	 * @private
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
