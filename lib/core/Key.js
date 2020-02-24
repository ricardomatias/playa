import ring from '@ricardomatias/ring';
import * as R from 'ramda';
import { roll, distribute } from '@ricardomatias/roll';
import { convert as convertToRoman } from 'roman-numeral';

import Scale from './Scale';
import Chord from './Chord';
import { distance, Random } from '../tools';

const TOTAL_MODES = 7;
const LOCRIAN_PROB = 0.01;
const PRECISION = 4;

const MODES_MOD_PROB = distribute.sumDistribution([
	'0.165', '0.165', '0.165', '0.165', '0.165', '0.165', '0.01',
], 3);

/**
 * Defines a key
 * @class
 * @memberof Core
 *
 * @name Key
 * @extends Scale
 */
class Key extends Scale {
	/**
	 * Creates an instance of Key.
	 * @constructor
	 * @memberof Core
	 *
	 * @param {String|Note} root
	 * @param {String} type the type of Scale to create
	 * @param {Array<Number>} [octaves] [starting, number of octaves] range of octaves to map notes to
	 * @param {Object} [opts]
	 * @param {Array<Number>} [opts.chordStructure] - f.ex: Chord.SIXTH
	 */
	constructor(root, type, octaves, { chordStructure = Chord.SEVENTH } = {}) {
		super(root, type, octaves);

		this._chordStructure = chordStructure;

		return new Proxy(this, {
			get(target, key, receiver) {
				if (key in target) {
					return Reflect.get(target, key, receiver);
				}

				if (Key.SCALES.has(key)) {
					let modes = target._modes;

					if (!modes) {
						target._modes = modes = target._createModes();
					}

					const mode = modes.filter((elem) => {
						return elem.scale === Key[key];
					})[0];

					return new Key(mode.root, mode.scale, octaves, { chordStructure });
				}
			},
		});
	}

	/**
	 * Gets the modes of the current key
	 * @method modes
	 * @memberof Core.Key#
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
	 * Modulate key based on a direction & interval
	 * @function modulate
	 * @memberof Core.Key#
	 *
	 * @param {Symbol} direction
	 * @param {String} [interval = '5P']
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
		} else
		if (direction === Key.MOD_DOWN) {
			root = distance.transposeDown(R.head(notes), interval);
		}

		this._root = root;
		this._notes = this._createScale();

		this.assignOctaves();

		delete this._modes;
	}

	/**
	 * Modulate key within it's relative modes based on a direction & interval
	 * @function modulateMode
	 * @memberof Core.Key#
	 *
	 * @param {Object} [opts = {}]
	 * @param {Symbol} [opts.direction]
	 * @param {Number} [opts.interval]
	 */
	modulateMode({ direction, interval } = {}) {
		let mode;
		let modes = this.modes;
		let probabilities = MODES_MOD_PROB;
		const modePos = this.modePosition;

		if (direction && !interval) {
			modes = R.splitAt(modePos, modes);

			if (direction === Key.MOD_UP) {
				if (modePos === 6) {
					// * LAST ELEMENT
					// Allow choosing any of the other modes
					modes = R.head(modes);
				} else {
					modes = R.tail(R.last(modes));
				}
			}

			if (direction === Key.MOD_DOWN) {
				if (modePos === 0) {
					// * FIRST ELEMENT
					// Allow choosing any of the other modes
					modes = R.tail(R.last(modes));
				} else {
					modes = R.head(modes);
				}
			}

			// Locrian shouldn't be appearing too often
			if (R.includes(Key.LOCRIAN, R.pluck('scale', modes))) {
				const modesLen = modes.length;

				modes = R.sort(R.ascend(R.propEq('scale', Key.LOCRIAN)), modes);

				const avgProb = ((1.0 - LOCRIAN_PROB) / (modesLen - 1.0)).toFixed(PRECISION);

				probabilities = distribute.sumDistribution(modes.map((_, idx) => {
					return idx === modesLen - 1 ? LOCRIAN_PROB.toFixed(PRECISION) : avgProb;
				}), PRECISION);
			} else {
				probabilities = distribute.equal(modes.length, PRECISION);
			}
		}

		if (!interval) {
			mode = roll(modes, probabilities, Random.float);
		} else {
			const dirMultiplier = direction === Key.MOD_DOWN ? -1 : 1;
			const newModePosition = modePos + ((interval - 1) * dirMultiplier);

			// f.ex: a 3rd is 2 places away not 3
			mode = ring(modes)[newModePosition];
		}

		this._root = mode.root;
		this._type = mode.scale;

		const rootPos = R.findIndex(R.propEq('note', mode.root), this._notes);
		const notesSplit = R.splitAt(rootPos, this._notes);

		this._notes = R.concat(R.last(notesSplit), R.head(notesSplit));

		this.assignOctaves();

		delete this._chord;
	}

	/**
	 * Get the mode position in Roman Numerals
	 * @function modePosition
	 * @memberof Core.Key#
	 *
	 * @param {Boolean} [inRomanNumber]
	 * @return {Number|String}
	 */
	get modePositionRoman() {
		const mode = this.type;

		if (!Key.isMode(mode)) {
			return null;
		}

		return convertToRoman(this.modePosition + 1);
	}

	/**
	 * Get the mode index
	 * @function modePosition
	 * @memberof Core.Key#
	 * @private
	 * @return {Number}
	 */
	get modePosition() {
		const mode = this.type;

		if (!Key.isMode(mode)) {
			return null;
		}

		return R.findIndex(R.propEq('root', this.root), this.modes);
	}

	/**
	 * Chord belonging to this mode
	 * @member chord
	 * @memberof Core.Key#
	 *
	 * @param {Chord.STRUCTURES} structure
	 * @return {Chord}
	 */
	get chord() {
		const mode = this._type;
		const root = this._root;
		const structure = this._chordStructure;

		if (!this._chord) {
			this._chord = new Chord({ root, type: mode, structure }, this._octaves);
		}

		return this._chord;
	}

	set chordStructure(structure) {
		this._chordStructure = structure;
	}

	/**
	 * Finds out the index of the scale and of the Ionian mode
	 * @private
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
	 * @function _createModes
	 * @memberof Core.Key#
	 * @private
	 * @return {Array<Mode>}
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
	 * @private
	 * @param {String} type
	 * @return {Boolean} isMajorMinor
	 * @memberof Key
	 */
	_isMajorMinor(type) {
		return [ Key.MAJOR, Key.MINOR ].indexOf(type) !== -1;
	}

	/**
	 * Checks if the key is a mode
	 * @function isMode
	 * @memberof Core.Key
	 * @static
	 * @param {String} mode
	 * @return {Boolean}
	 */
	static isMode(mode) {
		for (const [ name, m ] of Key.MODES.entries()) {
			if (mode === m || mode === name) {
				return true;
			}
		}
		return false;
	}

	_getModePosition(idx) {
		const modes = this.modes;

		if (idx > modes.length - 1) return null;

		const mode = modes[idx];

		return new Key(mode.root, mode.scale, this._octaves, { chordStructure: this._chordStructure });
	}

	get I() {
		return this._getModePosition(0);
	}

	get II() {
		return this._getModePosition(1);
	}

	get III() {
		return this._getModePosition(2);
	}

	get IV() {
		return this._getModePosition(3);
	}

	get V() {
		return this._getModePosition(4);
	}

	get VI() {
		return this._getModePosition(5);
	}

	get VII() {
		return this._getModePosition(6);
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
