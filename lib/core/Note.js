import whichAccident from '../utils/whichAccident';
import { SHARPS, ENHARMONICS, DIATONIC_NOTES } from './constants';

const TUNING = 440;

// TODO: Make MIDI, ENHARMONICS and NEIGHBORS lazy loaded

/**
 * Defines a note
 * @typedef {Object} Note
 *
 * @class Note
 */
class Note {
	/**
	 * @param {String} note - a note
	 * @param {Number} midi - a midi value
	 */
	constructor(note, midi) {
		const noteIndex = DIATONIC_NOTES.indexOf(note);

		this._note = noteIndex === -1 ? null : DIATONIC_NOTES[noteIndex];

		this._enharmonic = this._octave = this._midi = null;
		this._isFlat = false;
		this._isSharp = false;

		if (midi >= 0 || midi <= 127) {
			this._midi = midi;
		}

		if (typeof this._midi === 'number') {
			this._octave = this._findOctave(midi);

			this._freq = Math.pow(2, ((this._midi - 69) / 12)) * TUNING;
		}

		if (!this._note) {
			this._note = this._resolveEnharmonic(note);
		}

		if (!this._note) {
			return;
		}

		const { next, prev } = this._findNeighbors(this._note);

		this._next = next;
		this._prev = prev;
	}

	/**
   * Returns the note with oct
   *
   * @type {String}
   */
	get n() {
		const octave = this._octave;
		const midi = this._midi;

		if (octave) {
			return this._note + octave;
		}

		if (!midi || typeof octave !== 'number') {
			return this._note;
		}

		this._octave = this._findOctave(midi);

		return this._note + this._octave;
	}

	/**
   * Returns the enharmonic
   *
   * @type {String}
   */
	get e() {
		return this._enharmonic;
	}

	/**
   * Returns the enharmonic with oct
   *
   * @type {String}
   */
	get eoct() {
		// TODO: This can probably be removed
		const octave = this._octave;

		if (!octave) {
			return null;
		}
		return this._enharmonic + octave;
	}

	/**
   * Returns the midi number
   *
   * @type {Number}
   */
	get m() {
		return this._midi;
	}

	/**
   * Returns the note frequency
   *
   * @type {Number}
   */
	get f() {
		const midi = this._midi;

		if (this._freq) {
			return this._freq;
		}

		if (!midi) {
			return null;
		}

		this._freq = Math.pow(2, ((this._midi - 69) / 12)) * TUNING;

		return this._freq;
	}

	/**
   * Returns the distance to C (index)
   *
   * @type {Number}
   */
	get distC() {
		let note = this.n;

		if (this.isFlat()) {
			note = this.e;
		}

		return SHARPS.indexOf(note);
	}

	/**
   * Returns the next note a semitone away
   *
   * @type {Note}
   */
	get next() {
		return new Note(this._next);
	}

	/**
   * Returns the previous note a semitone away
   *
   * @type {Note}
   */
	get prev() {
		return new Note(this._prev);
	}

	/**
   * Is the note a flat
   *
   * @memberof Note
   * @return {Boolean} Returns if it's a flat
   */
	isFlat() {
		return this._isFlat;
	}

	/**
   * Is the note a sharp
   *
   * @memberof Note
   * @return {Boolean} Returns if it's a sharp
   */
	isSharp() {
		return this._isSharp;
	}


	/**
	 * Finds the octave based on the MIDI
	 *
	 * @param {Number} midi
	 * @return {Number} An octave
	 * @memberof Note
	 */
	_findOctave(midi) {
		return Math.floor(11 * (midi / 132)) - 1;
	}

	/**
	 * Tries to find the enharmonic of the note
	 *
	 * @param {string} note
	 * @return {String} enharmonic
	 * @memberof Note
	 */
	_resolveEnharmonic(note) {
		this._accident = whichAccident(note);

		if (!this._accident) {
			return null;
		}

		for (let index = 0; index < ENHARMONICS.length; index++) {
			const enharmonic = ENHARMONICS[index];
			const noteIndex = enharmonic.indexOf(note);

			if (noteIndex !== -1) {
				const enharmonicIndex = noteIndex === 0 ? 3 : 0;

				this._enharmonic = enharmonic.substr(enharmonicIndex, 2);
				break;
			}
		}

		if (!this._enharmonic) {
			return null;
		}

		return note;
	}


	/**
	 * Finds the neighboring notes
	 *
	 * @return {Object} [prev, next] Adjacent neighbors
	 * @memberof Note
	 */
	_findNeighbors() {
		let note = this._note;

		if (this._accident) {
			if (this._accident === 'b') {
				note = this._enharmonic;

				this._isFlat = true;
			} else {
				this._isSharp = true;
			}
		}

		const noteIndex = SHARPS.indexOf(note);
		// [0, 11]
		// -1 -> 11
		// 12 -> 0
		const prevIndex = noteIndex - 1;
		const nextIndex = noteIndex + 1;

		return {
			prev: SHARPS[prevIndex === -1 ? 11 : prevIndex],
			next: SHARPS[nextIndex === 12 ? 0 : nextIndex],
		};
	}
}

export default Note;
