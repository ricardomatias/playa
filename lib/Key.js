import Scale from './Scale';
import Mode from './Mode';
import Note from './Note';
import MODES from './modes';

const { MAJOR, MINOR, IONIAN, AEOLIAN } = Scale;

const TOTAL_MODES = 7;

/**
 * Defines a key
 * @typedef {Object} Key
 *
 * @class Key
 */
class Key {
	/**
	 *Creates an instance of Key.
	 * @param {String|Note} root
	 * @param {String} scaleType
	 * @memberof Key
	 */
	constructor(root, scaleType) {
		this.MOD_UP = 'MOD_UP';
		this.MOD_DOWN = 'MOD_DOWN';

		if (root instanceof Note) {
			this._root = root.n;
		} else {
			this._root = root;
		}

		this._scaleType = scaleType;
	}

	/**
	 * Gets the root note of the scale
	 *
	 * @type {Note}
	 */
	get root() {
		return this._root;
	}

	/**
	 * Gets the notes of the scale
	 *
	 * @type {Array<Note>}
	 * @return {Array<Note>} Array of Notes
	 */
	get notes() {
		const { scale } = this;
		const { notes } = scale;

		if (!notes.length) {
			return null;
		}

		return notes;
	}

	/**
	 * Gets the root note of the scale
	 *
	 * @type {Scale}
	 */
	get scale() {
		return new Scale(this._root, this._scaleType);
	}

	/**
	 * Gets the modes in the current key
	 *
	 * @type {Array<Mode>}
	 */
	get modes() {
		const { scale } = this;
		const { notes } = scale;

		// Order the notes, starting from the IONIAN mode
		const { ionianIndex, scaleIndex } = this._prepareModes();

		const orderedNotes = notes.slice(ionianIndex, TOTAL_MODES).concat(notes.slice(0, ionianIndex));

		const modes = [];

		for (let idx = 0; idx < TOTAL_MODES; idx++) {
			const mode = MODES[idx];
			const note = orderedNotes[idx];

			modes.push(new Mode(note, mode));
		}

		// Reverse ordering to go back to initial state;
		return modes.slice(scaleIndex, TOTAL_MODES).concat(modes.slice(0, scaleIndex));
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
		return [MAJOR, MINOR].indexOf(type) !== -1;
	}

	/**
	 * Finds out the index of the scale and of the Ionian mode
	 *
	 * @return {Object} [ionianIndex, scaleIndex]
	 * @memberof Key
	 */
	_prepareModes() {
		const { scale } = this;
		const isMajorMinor = this._isMajorMinor(scale.type);
		let scaleType = scale.type;

		if (!isMajorMinor && !this._isMode(scale.type)) {
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

	/**
	 * Modulates a Major/Minor scale up or down a fifth
	 *
	 * @param {String} direction
	 * @memberof Key
	 */
	modulate(direction) {
		// TODO: Allow Aeolian/Ionian to modulate
		const { scale } = this;
		const notes = scale.notesStr;

		if (!notes.length || !this._isMajorMinor(scale.type)) {
			return;
		}

		let root = notes[4];

		if (direction === this.MOD_DOWN) {
			root = notes[3];
		}

		this._root = root;
		this._scaleType = scale.type;
	}
}

export default Key;
