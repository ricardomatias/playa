import Note from './Note';
import Chord from './Chord';
import Scale from './Scale';
import MODES from './modes';

const MODES_INFO = [
	['M7', 'tonic'],
	['m7', 'subdominant'],
	['m7', 'mediant'],
	['M7', 'subdominant'],
	['7', 'dominant'],
	['m7', 'submediant'],
	['m7b5', 'leading']
];

/**
 * @typedef {Object} Mode
 *
 * @class Mode
 */
class Mode {
	/**
	 * Creates an instance of Mode.
	 * @param {String|Note} root - Mode's root
	 * @param {String} mode - The Mode's type
	 */
	constructor(root, mode) {
		if (root instanceof Note) {
			this._root = root.n;
		} else {
			this._root = root;
		}

		this._mode = mode;
	}

	/**
	 * Chord belonging to this mode
	 *
	 * @type {Chord}
	 * @memberof Mode
	 */
	get chord() {
		const mode = this._mode;
		const root = this._root;

		if (!this._chord) {
			const modeIdx = MODES.indexOf(mode);
			const modeInfo = MODES_INFO[modeIdx];
			const chordQuality = modeInfo[0];

			// TODO: Add some usage to this?
			this._function = modeInfo[1];

			this._chord = new Chord(`${root}${chordQuality}`);
		}

		return this._chord;
	}

	/**
	 * Scale belonging to this mode
	 *
	 * @type {Scale}
	 * @memberof Mode
	 */
	get scale() {
		const mode = this._mode;
		const root = this._root;

		if (!this._scale) {
			this._scale = new Scale(root, mode);
		}

		return this._scale;
	}
}

export default Mode;
