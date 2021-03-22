/* eslint-disable no-dupe-class-members */
import { whichAccident, stripOctave, hasOctave, parseNote } from '../utils/note';
import { Sharp, Sharps, Flats, Enharmonics, DiatonicNote, DiatonicNotes, NoteSymbol } from '../constants/note';
import { MidiNotes } from '../constants/midi';
import { findOctave, findFrequency } from '../tools/midi';
import { isUndefined } from '../utils/types-guards';
import { PlayaError } from '../utils/error';

export type NoteLike = Note | NoteSymbol | string | number;

/**
 * Defines a Note
 *
 * @class
 * @memberof Core#
 *
 * @name Note
 */
export class Note {
	#note: NoteSymbol;
	#octave: number | undefined;
	#midi: number | undefined;
	#freq: number | undefined;
	#enharmonic: NoteSymbol | undefined;
	#accident: string | undefined;
	#next: NoteSymbol;
	#prev: NoteSymbol;

	static SHARP = '#';
	static FLAT = 'b';
	static Sharps = Sharps;
	static Flats = Flats;

	constructor(note: string | number);
	constructor(note: NoteSymbol);
	constructor(note: NoteSymbol | string, midi: number);

	/**
	 * @constructs Note
	 * @memberof Core#
	 *
	 * @param {NoteSymbol|number} note - a musical note
	 * @param {number} [midi = undefined] - a midi value
	 * @example
	 * new Note('C3')
	 * new Note('C', 60)
	 * new Note('C')
	 * new Note(60)
	 */
	constructor(note: NoteSymbol | number | string, midi?: number) {
		let octave = 0;

		if (typeof note === 'number') {
			midi = note;
			const midiNote = MidiNotes[midi];

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

			midi = MidiNotes.indexOf(note);
			note = parsed.note;
			octave = parsed.octave;

			if (midi === -1) {
				const enh = this.resolveEnharmonic(note as NoteSymbol);

				if (enh) {
					midi = MidiNotes.indexOf(enh + parsed.octave);
				}
			}
		}

		if (typeof midi !== 'undefined') {
			if (midi >= 0 && midi <= 127) {
				this.#note = note as NoteSymbol;
				this.#midi = midi;
				this.#octave = findOctave(midi);
				this.#freq = findFrequency(midi);
				this.#accident = whichAccident(note);
			} else {
				throw new Error(`[Note]: <${note + octave}> isn't within the midi range of [0 - 127]`);
			}
		} else {
			const diatonicIndex = DiatonicNotes.indexOf(note as DiatonicNote);

			if (diatonicIndex !== -1) {
				this.#note = DiatonicNotes[diatonicIndex];
			} else if (this.hasAccident(note as NoteSymbol) && this.resolveEnharmonic(note as NoteSymbol)) {
				this.#note = note as NoteSymbol;
			} else {
				throw new Error(`[Note]: <${note}> isn't a recognized musical note`);
			}
		}

		if (isUndefined(this.#note)) {
			throw new PlayaError('[Note]', `<${note}> isn't a recognized musical note`);
		}

		const { next, prev } = this.findNeighbours();

		this.#next = next;
		this.#prev = prev;
	}

	/**
	 * note with octave
	 *
	 * @member pitch
	 * @memberof Core#Note#
	 * @example 'C4'
	 * @type {string}
	 */
	get pitch(): string {
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
	 * @example 'C'
	 * @type {string}
	 */
	get note(): NoteSymbol {
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
	get e(): NoteSymbol | undefined {
		return this.enharmonic;
	}

	/**
	 * Returns the enharmonic or itself if it doesn't have one
	 *
	 * @member enharmonic
	 * @memberof Core#Note#
	 * @example 'D#' => 'Eb'
	 * @type {String}
	 */
	get enharmonic(): NoteSymbol | undefined {
		if (!this.#enharmonic) {
			this.#enharmonic = this.resolveEnharmonic(this.#note);
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
			return Sharps.indexOf(enh as Sharp);
		}

		return Sharps.indexOf(note as Sharp);
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
		const midi = typeof this.#midi !== 'undefined' ? this.#midi + 1 : null;
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

	private getNeighbour(note: NoteSymbol, midi: number | null): Note {
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
	 * Does this note equal the other?
	 * Equality check done by comparing the Note (without octave), enharmonics and midi
	 * @function equals
	 * @param {Note} other
	 * @return {boolean}
	 * @memberof Core#Note#
	 */
	equals(other: Note): boolean {
		return this.note === other.note || this.midi === other.midi || this.note === other.e;
	}

	get [Symbol.toStringTag](): string {
		return `Note: ${this.pitch}`;
	}

	/**
	 * Tries to find the enharmonic of the note
	 * @private
	 * @param {string} note
	 * @return {String} enharmonic
	 * @memberof Note
	 */
	private resolveEnharmonic(note: NoteSymbol): NoteSymbol | undefined {
		let enharmonic = '';

		for (let index = 0; index < Enharmonics.length; index++) {
			const enharmonics = Enharmonics[index].split('|');
			const noteIndex = enharmonics.indexOf(note);

			if (noteIndex !== -1) {
				const enharmonicIndex = noteIndex ? 0 : 1;

				enharmonic = enharmonics[enharmonicIndex];
				break;
			}
		}

		if (!enharmonic) {
			return;
		}

		return <NoteSymbol>enharmonic;
	}

	private hasAccident(note: NoteSymbol) {
		if (!this.#accident) {
			this.#accident = whichAccident(note);
		}

		return !!this.#accident;
	}

	/**
	 * Finds the neighboring notes
	 * @private
	 * @return {Object} [prev, next] Adjacent neighbors
	 * @memberof Note
	 */
	private findNeighbours(): { prev: NoteSymbol; next: NoteSymbol } {
		let note: NoteSymbol | undefined = this.#note;

		if (!this.#accident) {
			this.#accident = whichAccident(note);
		}

		if (this.#accident === Note.FLAT) {
			note = this.enharmonic;
		}

		const noteIndex = Sharps.indexOf(note as Sharp);
		// [0, 11]
		// -1 -> 11
		// 12 -> 0
		const prevIndex = noteIndex - 1;
		const nextIndex = noteIndex + 1;

		return {
			prev: Sharps[prevIndex === -1 ? 11 : prevIndex],
			next: Sharps[nextIndex === 12 ? 0 : nextIndex],
		};
	}
}
