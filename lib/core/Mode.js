import HarmonyBase from './HarmonyBase';
import Chord from './Chord';
import Scale from './Scale';

/**
 * Defines a Mode
 * @class
 * @memberof Core
 *
 * @name Mode
 * @extends HarmonyBase
 */
class Mode extends HarmonyBase {
	/**
	 * Creates an instance of Mode.
	 * @constructor
	 * @memberof Core
	 *
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
	 * @member chord
	 * @memberof Core.Mode#
	 * @return {Chord}
	 */
	get chord() {
		const mode = this._type;
		const root = this._root;

		if (!this._chord) {
			const modeDetails = Mode.DETAILS.get(mode);
			const chordQuality = modeDetails[0];

			// TODO: Add some usage to this?
			this._function = modeDetails[1];

			this._chord = new Chord(`${root}${chordQuality}`);
		}

		return this._chord;
	}

	/**
	 * Scale belonging to this mode
	 * @member notes
	 * @memberof Core.Mode#
	 *
	 * @return {Scale}
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


Mode.MODES = new Map([
	[ 'IONIAN', Scale.IONIAN ],
	[ 'DORIAN', Scale.DORIAN ],
	[ 'PHRYGIAN', Scale.PHRYGIAN ],
	[ 'LYDIAN', Scale.LYDIAN ],
	[ 'MIXOLYDIAN', Scale.MIXOLYDIAN ],
	[ 'AEOLIAN', Scale.AEOLIAN ],
	[ 'LOCRIAN', Scale.LOCRIAN ],
]);

/**
 * @example Mode.IONIAN = '1P 2M 3M 4P 5P 6M 7M';
 */
for (const [ name, mode ] of Mode.MODES.entries()) {
	Mode[name] = mode;
}

Mode.DETAILS = new Map([
	[ Mode.IONIAN, [ 'M7', 'tonic' ] ],
	[ Mode.DORIAN, [ 'm7', 'subdominant' ] ],
	[ Mode.PHRYGIAN, [ 'm7', 'mediant' ] ],
	[ Mode.LYDIAN, [ 'M7', 'subdominant' ] ],
	[ Mode.MIXOLYDIAN, [ '7', 'dominant' ] ],
	[ Mode.AEOLIAN, [ 'm7', 'submediant' ] ],
	[ Mode.LOCRIAN, [ 'm7b5', 'leading' ] ],
]);

export default Mode;
