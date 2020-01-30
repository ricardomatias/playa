import { whichAccident, stripOctave, hasOctave, parseOctave } from '../utils/note';
import { SHARPS, FLATS, ENHARMONICS, DIATONIC_NOTES, MIDI_NOTES } from '../constants';

const TUNING = 440;

//  * For middle C to be C3 - 2
//  * For middle C to be C4 - 1
const MIDI_OCTAVE_OFFSET = 2;

/**
 * Defines a note
 * @class
 * @memberof Core
 * @name Note
 */
class Note {
	/**
	 * Creates an instance of Note.
	 * @constructor
	 * @memberof Core
	 *
	 * @param {String|Number} note - a note
	 * @param {Number} midi - a midi value
	 */
	constructor(note, midi) {
		if (typeof note === 'number') {
			midi = note;
			note = stripOctave(MIDI_NOTES[midi]);
		}

		this._enharmonic = this._octave = this._midi = null;

		if (hasOctave(note)) {
			const parsed = parseOctave(note);

			this._octave = parsed.octave;
			midi = MIDI_NOTES.indexOf(note);
			note = parsed.note;
		}

		const noteIndex = DIATONIC_NOTES.indexOf(note);

		this._note = noteIndex === -1 ? null : DIATONIC_NOTES[noteIndex];

		this._isFlat = this._isSharp = false;

		if (midi >= 0 || midi <= 127) {
			this._midi = midi;
		}

		if (typeof this._midi === 'number') {
			this._octave = this._octave || this._findOctave(midi);

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
	 * Returns the note with octave
	 * @member n
	 * @memberof Core.Note#
	 * @example 'C4'
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
	* Returns the note without octave
	* @member note
	* @memberof Core.Note#
	* @example 'C4'
	* @type {String}
	*/
	get note() {
		return this._note;
	}

	get octave() {
		return this._octave;
	}

	/**
	 * Returns the enharmonic
	 * @member e
	 * @memberof Core.Note#
	 * @example 'D#' => 'Eb'
	 * @type {String}
	 */
	get e() {
		if (!this._enharmonic) {
			return this._resolveEnharmonic(this._note);
		}

		return this._enharmonic;
	}

	/**
	* Returns the enharmonic
	* @member enharmonic
	* @memberof Core.Note#
	* @example 'D#' => 'Eb'
	* @type {String}
	*/
	get enharmonic() {
		return this.e;
	}

	/**
	 * Returns the enharmonic with oct
	 * @member eoct
	 * @memberof Core.Note#
	 * @example 'D#3' => 'Eb3'
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
	 * @member m
	 * @memberof Core.Note#
	 * @example 60 // C3
	 * @type {Number}
	 */
	get m() {
		return this._midi;
	}

	/**
	* Returns the midi number
	* @member m
	* @memberof Core.Note#
	* @example 60 // C3
	* @type {Number}
	*/
	get midi() {
		return this._midi;
	}

	/**
	 * Returns the note frequency
	 * @member f
	 * @memberof Core.Note#
	 * @example 440 // A3
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
	* Returns the note frequency
	* @member freq
	* @memberof Core.Note#
	* @example 440 // A3
	* @type {Number}
	*/
	get freq() {
		return this.f;
	}

	/**
	 * Returns the distance to C as index
	 * @member distC
	 * @memberof Core.Note#
	 * @example 440 // A3
	 * @return {Number}
	 */
	get distC() {
		let note = this._note;

		if (this.isFlat) {
			note = this.e;
		}

		return SHARPS.indexOf(note);
	}

	/**
	 * Returns the next note a semitone away
	 * @member next
	 * @memberof Core.Note#
	 * @example 'C' => Note('C#')
	 * @return {Note}
	 */
	get next() {
		const midi = this._midi ? this._midi + 1 : null;
		return new Note(this._next, midi);
	}

	/**
	* Returns the previous note a semitone away
	* @member prev
	* @memberof Core.Note#
	* @example 'Eb' => Note('D')
	* @return {Note}
	*/
	get prev() {
		const midi = this._midi ? this._midi - 1 : null;
		return new Note(this._prev, midi);
	}

	/**
	 * Is the note a flat
	 * @member isFlat
	 * @memberof Core.Note#
	 * @return {Boolean}
	 */
	get isFlat() {
		return this._accident === Note.FLAT;
	}

	/**
	 * Is it a natural note
	 * @member isNatural
	 * @memberof Core.Note#
	 * @return {Boolean}
	 */
	get isNatural() {
		return !this._accident;
	}

	/**
	 * Is the note a sharp
	 * @member isSharp
	 * @memberof Core.Note#
	 * @example 'Eb' => 'D'
	 * @return {Boolean}
	 */
	get isSharp() {
		return this._accident === Note.SHARP;
	}


	/**
	 * Finds the octave based on the MIDI
	 * @private
	 * @param {Number} midi
	 * @return {Number} An octave
	 * @memberof Note
	 */
	_findOctave(midi) {
		return Math.floor(11 * (midi / 132)) - MIDI_OCTAVE_OFFSET;
	}

	/**
	 * Tries to find the enharmonic of the note
	 * @private
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
	 * @private
	 * @return {Object} [prev, next] Adjacent neighbors
	 * @memberof Note
	 */
	_findNeighbors() {
		let note = this._note;

		if (this._accident === Note.FLAT) {
			note = this._enharmonic;
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

Note.SHARP = '#';
Note.FLAT = 'b';

Note.SHARPS = SHARPS;
Note.FLATS = FLATS;

export default Note;
