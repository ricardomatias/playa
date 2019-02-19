import Scale from './Scale';
import Chord from './Chord';
import { distance, roll, distribute } from '../tools';
import * as R from 'ramda';

const TOTAL_MODES = 7;

const MODES_MOD_PROB = distribute.sumDistribution([
	'0.155', '0.155', '0.155', '0.155', '0.155', '0.155', '0.071',
]);

/**
 * Defines a key
 * @typedef {Object} Key
 *
 * @class Key
 */
class Key extends Scale {
	/**
	 *Creates an instance of Key.
	 * @param {String|Note} root
	 * @param {String} type the type of Scale to create
	 * @param {Object} [opts]
	 * @param {NoteType} [opts.noteType] the note's value type
	 * @memberof Key
	 */
	constructor(root, type, opts = {}) {
		super(root, type, opts);

		this._chordStructure = opts.chordStructure || Chord.SEVENTH;

		return new Proxy(this, {
			get(target, key, receiver) {
				if (key in target) {
					return Reflect.get(target, key, receiver);
				}

				if (Key[key]) {
					let modes = target._modes;

					if (!modes) {
						target._modes = modes = target._createModes();
					}

					const mode = modes.filter((elem) => {
						return elem.scale === Key[key];
					})[0];

					return new Key(mode.root, mode.scale, opts);
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

		return modes;
	}

	/**
	 * Modulates a Major/Minor scale up or down a fifth
	 *
	 * @param {Symbol} direction
	 * @param {String} interval
	 * @memberof Key
	 */
	modulate(direction, interval = '5P') {
		const notes = this._notes;
		const type = this._type;

		if (!notes.length || !Key.isMode(type)) {
			return;
		}

		let root;

		if (direction === Key.MOD_UP) {
			root = distance.transposeUp(R.head(notes), interval);
		}

		if (direction === Key.MOD_DOWN) {
			root = distance.transposeDown(R.head(notes), interval);
		}

		this._root = root;
		this._notes = this._createScale();

		delete this._modes;
	}

	modulateMode() {
		const modes = this.modes;
		const mode = roll(modes, MODES_MOD_PROB);

		this._root = mode.root;
		this._type = mode.scale;

		const rootPos = R.findIndex(R.propEq('n', mode.root), this._notes);
		const notesSplit = R.splitAt(rootPos, this._notes);

		this._notes = R.concat(R.last(notesSplit), R.head(notesSplit));

		delete this._chord;
	}

	/**
	 * Get the mode position in Roman Numerals
	 *
	 * @readonly
	 * @memberof Key
	 */
	get modePosition() {
		const mode = this.type;

		return Key.isMode(mode) ? R.head(Key.MODES.get(mode)) : null;
	}

	/**
	 * Chord belonging to this mode
	 *
	 * @param {Chord.STRUCTURES} structure
	 * @return {Chord}
	 */
	get chord() {
		const mode = this._type;
		const root = this._root;
		const structure = this._chordStructure;

		if (!this._chord) {
			this._chord = new Chord({ root, type: mode, structure });
		}

		return this._chord;
	}

	set chordStructure(structure) {
		this._chordStructure = structure;
	}

	/**
	 * Finds out the index of the scale and of the Ionian mode
	 *
	 * @return {Object} [ionianIndex, scaleIndex]
	 * @memberof Key
	 */
	_prepareModes() {
		let scaleType = this._type;
		const isMajorMinor = this._isMajorMinor(scaleType);

		if (!isMajorMinor && !Key.isMode(scaleType)) {
			return [];
		}

		if (isMajorMinor) {
			scaleType = scaleType === Key.MAJOR ? Key.IONIAN : Key.AEOLIAN;
		}

		const scaleIndex = Array.from(Key.MODES.keys()).indexOf(scaleType);

		const ionianIndex = TOTAL_MODES - scaleIndex;

		return {
			ionianIndex,
			scaleIndex,
		};
	}

	/**
	 * Creates the modes of the key
	 *
	 * @return {Array<Mode>}
	 * @memberof Key
	 */
	_createModes() {
		const notes = this._notes;

		// Order the notes, starting from the IONIAN mode
		const { ionianIndex, scaleIndex } = this._prepareModes();

		const orderedNotes = notes.slice(ionianIndex, TOTAL_MODES).concat(notes.slice(0, ionianIndex));

		let modes = [];
		let index = 0;

		for (const scale of Key.MODES.keys()) {
			const root = orderedNotes[index++].note;

			modes.push({ scale, root });
		}

		// Reverse ordering to go back to initial state;
		modes = modes.slice(scaleIndex, TOTAL_MODES).concat(modes.slice(0, scaleIndex));

		this._modes = modes;

		return modes;
	}

	/**
	 * Checks if the scale is Major or Minor
	 *
	 * @param {String} type
	 * @return {Boolean} isMajorMinor
	 * @memberof Key
	 */
	_isMajorMinor(type) {
		return [ Key.MAJOR, Key.MINOR ].indexOf(type) !== -1;
	}

	static isMode(mode) {
		for (const [ name, m ] of Key.MODES.entries()) {
			if (mode === m || mode === name) {
				return true;
			}
		}
		return false;
	}
}

Key.MOD_UP = Symbol('MOD_UP');
Key.MOD_DOWN = Symbol('MOD_DOWN');
Key.MOD_INTERVALS = [ '4P', '5P', '2M', '7m', '3m', '6M', '3M', '6m', '2m', '7M' ]; // from less spicy to spicyest

Key.MODES = new Map([
	[ Key.IONIAN, [ 'I', 'tonic' ] ],
	[ Key.DORIAN, [ 'II', 'subdominant' ] ],
	[ Key.PHRYGIAN, [ 'III', 'mediant' ] ],
	[ Key.LYDIAN, [ 'IV', 'subdominant' ] ],
	[ Key.MIXOLYDIAN, [ 'V', 'dominant' ] ],
	[ Key.AEOLIAN, [ 'VI', 'submediant' ] ],
	[ Key.LOCRIAN, [ 'VII', 'leading' ] ],
]);

export default Key;
