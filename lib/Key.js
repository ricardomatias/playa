const Scale = require('./Scale');
const Mode = require('./Mode');
const MODES = require('./modes');

const TOTAL_MODES = 7;

/**
 * Defines a key
 *
 * @class Key
 */
class Key {
	constructor(root, scaleType) {
		this.MOD_UP = 'MOD_UP';
		this.MOD_DOWN = 'MOD_DOWN';

		this._root = root;
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
	 * @returns {Array<Note>} Array of Notes
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
		const { ionianIndex, modeIndex } = this._prepareModes();

		const orderedNotes = notes.slice(ionianIndex, TOTAL_MODES).concat(notes.slice(0, ionianIndex));

		const modes = [];

		for (let idx = 0; idx < TOTAL_MODES; idx++) {
			const mode = MODES[idx];
			const note = orderedNotes[idx];

			modes.push(new Mode(note, mode));
		}

		// Reverse ordering to go back to initial state;
		return modes.slice(modeIndex, TOTAL_MODES).concat(modes.slice(0, modeIndex));
	}

	/**
	 * Check it it's a mode
	 *
	 * @param {String} type type
	 * @private
	 * @returns {Boolean} Is a mode?
	 */
	_isMode(type) {
		return MODES.indexOf(type) !== -1;
	}

	_isMajorMinor(type) {
		return [Scale.MAJOR, Scale.MINOR].indexOf(type) !== -1;
	}

	_prepareModes() {
		const { scale } = this;
		const isMajorMinor = this._isMajorMinor(scale.type);
		let scaleType = scale.type;

		if (!isMajorMinor && !this._isMode(scale.type)) {
			return [];
		}

		if (isMajorMinor) {
			scaleType = scaleType === Scale.MAJOR ? Scale.IONIAN : Scale.AEOLIAN;
		}

		const modeIndex = MODES.indexOf(scaleType);

		const ionianIndex = TOTAL_MODES - modeIndex;

		return {
			ionianIndex,
			modeIndex
		};
	}

	modulate(direction) {
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

module.exports = Key;
