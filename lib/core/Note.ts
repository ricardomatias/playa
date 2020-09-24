/* eslint-disable no-dupe-class-members */
import { whichAccident, stripOctave, hasOctave, parseNote } from '../utils/note';
import { SHARPS, FLATS, ENHARMONICS, DIATONIC_NOTES, MIDI_NOTES } from '../constants';
import { findOctave, findFrequency } from '../tools/midi';


/**
 * Defines a Note
 *
 * @class
 * @memberof Core#
 *
 * @name Note
 */
export class Note {
	#note = '';
	#octave: number | undefined;
	#midi: number | undefined;
	#freq: number | undefined;
	#enharmonic: string | undefined;
	#accident: string | undefined;
	#isFlat = false;
	#isSharp = false;
	#next: string;
	#prev: string;

	static SHARP = '#';
	static FLAT = 'b';
	static SHARPS: string[] = SHARPS;
	static FLATS: string[] = FLATS;

	constructor(note: number);
	constructor(note: string);
	constructor(note: string, midi: number);

	/**
	* @constructs Note
	* @memberof Core#
	*
	* @param {string|number} note - a musical note
	* @param {number} [midi = undefined] - a midi value
	* @example
	* new Note('C3')
	* new Note('C', 60)
	* new Note('C')
	* new Note(60)
	*/
	constructor(note: string | number, midi?: number) {
		let octave = 0;

		if (typeof note === 'number') {
			midi = note;
			const midiNote = MIDI_NOTES[midi];

			if (!midiNote) {
				throw new Error(`[Note]: <${midi}> isn't a valid midi note number`);
			}

			note = stripOctave(midiNote);
		}

		if (hasOctave(note)) {
			const parsed = parseNote(note);

			if (!parsed) {
				throw new Error(`[Note]: <${note}> isn't a recognized musical note`);
			}

			midi = MIDI_NOTES.indexOf(note);
			note = parsed.note;
			octave = parsed.octave;

			if (midi === -1) {
				const enh = this._resolveEnharmonic(note);

				if (enh) {
					midi = MIDI_NOTES.indexOf(enh + parsed.octave);
				}
			}
		}

		if (typeof midi !== 'undefined') {
			if (midi >= 0 && midi <= 127) {
				this.#note = note;
				this.#midi = midi;
				this.#octave = findOctave(midi);
				this.#freq = findFrequency(midi);
				this.#accident = whichAccident(note);
			} else {
				throw new Error(`[Note]: <${note + octave}> isn't within the midi range of [0 - 127]`);
			}
		}

		if (!this.#note) {
			const diatonicIndex = DIATONIC_NOTES.indexOf(note);

			if (diatonicIndex !== -1) {
				this.#note = DIATONIC_NOTES[diatonicIndex];
			} else if (this._resolveEnharmonic(note)) {
				this.#note = note;
			}

			if (this.#note === '') {
				throw new Error(`[Note]: <${note}> isn't a recognized musical note`);
			}
		}

		const { next, prev } = this._findNeighbours();

		this.#next = next;
		this.#prev = prev;
	}


	/**
	 * note with octave
	 *
	 * @member n
	 * @memberof Core#Note#
	 * @example 'C4'
	 * @type {string}
	 */
	get n(): string {
		const octave = this.#octave;
		const midi = this.#midi;

		if (octave) {
			return this.#note + octave;
		}

		if (!midi || typeof octave !== 'number') {
			return this.#note;
		}

		this.#octave = findOctave(midi);

		return this.#note + this.#octave;
	}

	/**
	 * note
	 *
	 * @member note
	 * @memberof Core#Note#
	 * @example 'C4'
	 * @type {string}
	 */
	get note(): string {
		return this.#note;
	}

	/**
	 * octave
	 *
	* @member octave
	* @memberof Core#Note#
	* @example C3 => 3
	* @readonly
	* @type {number}
	 */
	get octave(): number | undefined {
		return this.#octave;
	}

	/**
	 * Returns the enharmonic
	 *
	 * @member e
	 * @memberof Core#Note#
	 * @example 'D#' => 'Eb'
	 * @type {String}
	 */
	get e(): string | undefined {
		return this.enharmonic;
	}

	/**
	* Returns the enharmonic
	*
	* @member enharmonic
	* @memberof Core#Note#
	* @example 'D#' => 'Eb'
	* @type {String}
	*/
	get enharmonic(): string | undefined {
		if (!this.#enharmonic) {
			this.#enharmonic = this._resolveEnharmonic(this.#note);
		}

		return this.#enharmonic;
	}

	/**
	 * Returns the enharmonic with oct
	 *
	 * @member eoct
	 * @memberof Core#Note#
	 * @example 'D#3' => 'Eb3'
	 * @type {string}
	 */
	get eoct(): string | null {
		// TODO: This can probably be removed
		const octave = this.#octave;

		if (!octave) return null;

		const enh = this.e;

		if (!enh) return null;

		return enh + octave;
	}

	/**
	 * Returns the midi number
	 *
	 * @member m
	 * @memberof Core#Note#
	 * @example 60 // C3
	 * @type {Number}
	 */
	get m(): number | undefined {
		return this.#midi;
	}

	/**
	* Returns the midi number
	* @member midi
	* @memberof Core#Note#
	* @example 60 // C3
	* @type {Number}
	*/
	get midi(): number | undefined {
		return this.#midi;
	}

	/**
	 * Returns the note frequency
	 *
	 * @member f
	 * @memberof Core#Note#
	 * @example 440 // A3
	 * @type {Number}
	 */
	get f(): number | undefined {
		return this.freq;
	}

	/**
	* Returns the note frequency
	* @member freq
	* @memberof Core#Note#
	* @example 440 // A3
	* @type {Number}
	*/
	get freq(): number | undefined {
		const midi = this.#midi;

		if (this.#freq) {
			return this.#freq;
		}

		if (!midi) {
			return undefined;
		}

		this.#freq = findFrequency(midi);

		return this.#freq;
	}

	/**
	 * Returns the distance to C as index
	 *
	 * @member distC
	 * @memberof Core#Note#
	 * @example 'D' => 2
	 * @return {Number}
	 */
	get distC(): number {
		const note = this.#note;
		const enh = this.e;

		if (this.isFlat && enh) {
			return SHARPS.indexOf(enh);
		}

		return SHARPS.indexOf(note);
	}

	/**
	 * Returns the next note a semitone away
	 *
	 * @member next
	 * @memberof Core#Note#
	 * @example 'C' => Note('C#')
	 * @return {Note}
	 */
	get next(): Note {
		const midi = this.#midi ? this.#midi + 1 : null;
		return this.getNeighbour(this.#next, midi);
	}

	/**
	* Returns the previous note a semitone away
	*
	* @member prev
	* @memberof Core#Note#
	* @example 'Eb' => Note('D')
	* @return {Note}
	*/
	get prev(): Note {
		const midi = this.#midi ? this.#midi - 1 : null;
		return this.getNeighbour(this.#prev, midi);
	}

	private getNeighbour(note: string, midi: number | null): Note {
		if (!midi) {
			return new Note(note);
		}

		return new Note(note, midi);
	}

	/**
	 * Is the note a flat
	 *
	 * @member isFlat
	 * @memberof Core#Note#
	 * @return {Boolean}
	 */
	get isFlat(): boolean {
		return this.#accident === Note.FLAT;
	}

	/**
	 * Is it a natural note
	 * @member isNatural
	 * @memberof Core#Note#
	 * @return {Boolean}
	 */
	get isNatural(): boolean {
		return !this.#accident;
	}

	/**
	 * Is the note a sharp
	 * @member isSharp
	 * @memberof Core#Note#
	 * @example 'Eb' => 'D'
	 * @return {Boolean}
	 */
	get isSharp(): boolean {
		return this.#accident === Note.SHARP;
	}

	/**
	 * Tries to find the enharmonic of the note
	 * @private
	 * @param {string} note
	 * @return {String} enharmonic
	 * @memberof Note
	 */
	private _resolveEnharmonic(note: string): string | undefined {
		let enharmonic = '';

		if (!this.#accident) {
			this.#accident = whichAccident(note);
		}

		if (!this.#accident) {
			return '';
		}

		for (let index = 0; index < ENHARMONICS.length; index++) {
			const enharmonics = ENHARMONICS[index];
			const noteIndex = enharmonics.indexOf(note);

			if (noteIndex !== -1) {
				const enharmonicIndex = noteIndex === 0 ? 3 : 0;

				enharmonic = enharmonics.substr(enharmonicIndex, 2);
				break;
			}
		}

		if (!enharmonic) {
			return;
		}

		return enharmonic;
	}


	/**
	 * Finds the neighboring notes
	 * @private
	 * @return {Object} [prev, next] Adjacent neighbors
	 * @memberof Note
	 */
	private _findNeighbours(): { prev: string; next: string } {
		let note = this.#note;

		if (!this.#accident) {
			this.#accident = whichAccident(note);
		}

		if (this.#accident === Note.FLAT) {
			note = this.enharmonic || '';
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
