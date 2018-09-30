import HarmonyBase from './HarmonyBase';
import Chord from './Chord';
import Scale from './Scale';

const MODES_INFO = [
	[ 'M7', 'tonic' ],
	[ 'm7', 'subdominant' ],
	[ 'm7', 'mediant' ],
	[ 'M7', 'subdominant' ],
	[ '7', 'dominant' ],
	[ 'm7', 'submediant' ],
	[ 'm7b5', 'leading' ],
];

/**
 * @typedef {Object} Mode
 *
 * @class Mode
 */
class Mode extends HarmonyBase {
	/**
	 * Creates an instance of Mode.
	 * @param {String|Note} root - Mode's root
	 * @param {String} type - The Mode's type
	 * @param {Object} [opts]
	 * @param {NoteType} [opts.noteType] the note's value type
	 */
	constructor(root, type, { noteType } = {}) {
		super(root, type, noteType);
	}

	/**
	 * Chord belonging to this mode
	 *
	 * @type {Chord}
	 * @memberof Mode
	 */
	get chord() {
		const mode = this._type;
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
	get notes() {
		const mode = this._type;
		const root = this._root;
		const notes = this._notes;
		const noteType = this._noteType;

		if (!notes.length) {
			this._notes = new Scale(root, mode, { noteType })._notes;
		}

		return super.notes;
	}
}

export default Mode;

const MODES = [
	Scale.IONIAN,
	Scale.DORIAN,
	Scale.PHRYGIAN,
	Scale.LYDIAN,
	Scale.MIXOLYDIAN,
	Scale.AEOLIAN,
	Scale.LOCRIAN,
];

export {
	MODES,
};
