import HarmonyBase from './HarmonyBase';
import Scale from './Scale';
import NoteType from './types';
import Mode, { MODES } from './Mode';
import { mapModes } from '../utils/map';

const { MAJOR, MINOR, IONIAN, AEOLIAN } = Scale;

const TOTAL_MODES = 7;


/**
 * Defines a key
 * @typedef {Object} Key
 *
 * @class Key
 */
class Key extends HarmonyBase {
	/**
	 *Creates an instance of Key.
	 * @param {String|Note} root
	 * @param {String} type the type of Scale to create
	 * @param {Object} [opts]
	 * @param {NoteType} [opts.noteType] the note's value type
	 * @memberof Key
	 */
	constructor(root, type, { noteType } = {}) {
		super(root, type, noteType);

		if (root && type) {
			this._notes = this._createScale();
		}

		return new Proxy(this, {
			get(target, key, receiver) {
				if (key in target) {
					return Reflect.get(target, key, receiver);
				}

				if (MODES.includes(key)) {
					let modes = target._modes;

					if (!modes) {
						target._modes = modes = target._createModes();
					}

					return modes.filter((elem) => {
						return elem.type === key;
					})[0];
				}
			},
		});
	}

	/**
	 * Gets the modes in the current key
	 *
	 * @type {Array<Mode>}
	 */
	get modes() {
		let modes = this._modes;

		if (!modes) {
			modes = this._createModes();
		}

		return mapModes(modes, 'chord');
	}

	/**
	 * Modulates a Major/Minor scale up or down a fifth
	 *
	 * @param {String} direction
	 * @memberof Key
	 */
	modulate(direction) {
		/*
			TODO: Allow Aeolian/Ionian to modulate
			TODO: Research modulation, what can be modulated?
		*/
		const notes = this._notes;
		const type = this._type;

		if (!notes.length || !this._isMajorMinor(type)) {
			return;
		}

		let root = notes[4];

		if (direction === Key.MOD_DOWN) {
			root = notes[3];
		}

		this._root = root;
		this._notes = this._createScale();
	}

	/**
	 * Creates the modes of the key
	 *
	 * @return {Array<Mode>}
	 * @memberof Key
	 */
	_createModes() {
		const notes = this._notes;
		const noteType = this._noteType;

		// Order the notes, starting from the IONIAN mode
		const { ionianIndex, scaleIndex } = this._prepareModes();

		const orderedNotes = notes.slice(ionianIndex, TOTAL_MODES).concat(notes.slice(0, ionianIndex));

		let modes = [];

		for (let idx = 0; idx < TOTAL_MODES; idx++) {
			const mode = MODES[idx];
			const note = orderedNotes[idx];

			modes.push(new Mode(note, mode, { noteType }));
		}

		// Reverse ordering to go back to initial state;
		modes = modes.slice(scaleIndex, TOTAL_MODES).concat(modes.slice(0, scaleIndex));

		this._modes = modes;

		return modes;
	}

	/**
	 * Creates a scale
	 *
	 * @return {Array<Note>} Notes
	 * @memberof Key
	 */
	_createScale() {
		return new Scale(this.root, this.type, { noteType: NoteType.NOTE }).notes;
	}

	/**
	 * Check it it's a mode
	 *
	 * @param {String} type type
	 * @private
	 * @return {Boolean} Is a mode?
	 */
	_isMode(type) {
		return MODES.indexOf(type) !== -1;
	}

	/**
	 * Checks if the scale is Major or Minor
	 *
	 * @param {String} type
	 * @return {Boolean} isMajorMinor
	 * @memberof Key
	 */
	_isMajorMinor(type) {
		return [ MAJOR, MINOR ].indexOf(type) !== -1;
	}

	/**
	 * Finds out the index of the scale and of the Ionian mode
	 *
	 * @return {Object} [ionianIndex, scaleIndex]
	 * @memberof Key
	 */
	_prepareModes() {
		let scaleType = this.type;
		const isMajorMinor = this._isMajorMinor(scaleType);

		if (!isMajorMinor && !this._isMode(scaleType)) {
			return [];
		}

		if (isMajorMinor) {
			scaleType = scaleType === MAJOR ? IONIAN : AEOLIAN;
		}

		const scaleIndex = MODES.indexOf(scaleType);

		const ionianIndex = TOTAL_MODES - scaleIndex;

		return {
			ionianIndex,
			scaleIndex,
		};
	}
}

Key.MOD_UP = Symbol('MOD_UP');
Key.MOD_DOWN = Symbol('MOD_DOWN');

export default Key;
