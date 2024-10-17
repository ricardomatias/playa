/* eslint-disable no-dupe-class-members */
import ring from '@ricardomatias/ring';

import {
	whichAccident,
	stripOctave,
	isPitch,
	parseNote,
	findOctave,
	findFrequency,
	ACCIDENT_REGEXP,
	findCMidiByOctave,
} from '../utils/note';
import { Sharp, Sharps, Flats, Enharmonics, DiatonicNote, DiatonicNotes, NoteSymbol, Flat } from '../constants/note';
import { isDefined, isNumber, isUndefined } from '../utils/types-guards';
import { PlayaError } from '../utils/error';
import { Interval, Semitones } from '../constants';

export type NoteLike = string | number | Note | NoteSymbol;

/**
 * Note Type
 * @memberof Types
 * @typedef NoteType
 * @enum
 * @param {string} Natural "natural"
 * @param {string} Sharp "sharp"
 * @param {string} Flat "flat"
 */
export enum NoteType {
	Natural = 'natural',
	Sharp = 'sharp',
	Flat = 'flat',
}

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
	#octave: number;
	#midi: number;
	#freq: number;
	#enharmonic: NoteSymbol;
	#accident: string | undefined;
	#next: NoteSymbol;
	#prev: NoteSymbol;
	#type: NoteType = NoteType.Natural;

	static SHARP = '#';
	static FLAT = 'b';
	static Sharps = Sharps;
	static Flats = Flats;

	/**
	 * Chord structures used to create chords
	 *
	 * @member Type
	 * @memberof Core#Note
	 * @enum
	 * @static
	 * @type {NoteType}
	 *
	 * @example NoteType.Flat => 'flat'
	 */
	static Type = NoteType;

	// constructor(note: NoteSymbol | string, midi: number);

	/**
	 * @description
	 * A note without midi, will be assigned a midi number from the middle (3rd) octave
	 *
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
	 * Note.fromOctave('C', 3)
	 */
	constructor(note: NoteLike, midi?: number) {
		let octave = 0;

		if (Note.isNote(note)) {
			midi = note.midi;
			note = note.note;
		} else if (isNumber(note)) {
			midi = note;
			note = stripOctave(Note.extractPitch(midi));
		} else if (isPitch(note)) {
			const parsed = parseNote(note);

			if (!parsed) {
				throw new Error(`[Note]: <${note}> isn't a recognized musical note`);
			}

			note = parsed.note;
			octave = parsed.octave;
			midi = findCMidiByOctave(octave) + Note.position(note);
		}

		if (typeof midi !== 'undefined') {
			if (midi >= 0 && midi <= 127) {
				this.#note = note as NoteSymbol;
				this.#enharmonic = this.resolveEnharmonic(this.#note);
				this.#midi = midi;
				this.#octave = findOctave(midi);
				this.#freq = findFrequency(midi);
				this.#accident = whichAccident(note);
			} else {
				throw new Error(`[Note]: <${note + octave}> isn't within the midi range of [0 - 127]`);
			}
		} else {
			const diatonicIndex = DiatonicNotes.indexOf(note as DiatonicNote);
			const enh = this.resolveEnharmonic(note as NoteSymbol);

			if (diatonicIndex !== -1) {
				this.#note = DiatonicNotes[diatonicIndex];
				this.#enharmonic = this.#note;
				// enh !== note - tests that it's a valid note and not something like Cb
			} else if (this.hasAccident(note as NoteSymbol) && enh !== note) {
				this.#note = note as NoteSymbol;
				this.#enharmonic = enh;
			} else {
				throw new Error(`[Note]: <${note}> isn't a recognized musical note`);
			}

			this.#midi = 60 + this.distC;
			this.#octave = 3;
			this.#freq = findFrequency(this.#midi);
		}

		if (isUndefined(this.#note)) {
			throw new PlayaError('[Note]', `<${note}> isn't a recognized musical note`);
		}

		const { next, prev } = this.findNeighbours();

		this.#next = next;
		this.#prev = prev;

		if (this.isFlat) {
			this.#type = NoteType.Flat;
		} else if (this.isSharp) {
			this.#type = NoteType.Sharp;
		}
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
	get octave(): number {
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
	get e(): NoteSymbol {
		return this.enharmonic;
	}

	/**
	 * Returns the enharmonic
	 *
	 * @member e
	 * @memberof Core#Note#
	 * @example 'D#' => 'Eb'
	 * @type {String}
	 */
	get epitch(): NoteSymbol {
		return this.enharmonicPitch;
	}

	/**
	 * Returns the enharmonic or itself if it doesn't have one
	 *
	 * @member enharmonic
	 * @memberof Core#Note#
	 * @example 'D#' => 'Eb'
	 * @type {String}
	 */
	get enharmonic(): NoteSymbol {
		if (!this.#enharmonic) {
			this.#enharmonic = this.resolveEnharmonic(this.#note);
		}

		return this.#enharmonic;
	}

	/**
	 * Returns the enharmonic pitch
	 *
	 * @member enharmonicPitch
	 * @memberof Core#Note#
	 * @example 'D#3' => 'Eb3'
	 * @type {string}
	 */
	get enharmonicPitch(): NoteSymbol {
		const octave = this.#octave;
		const enh = this.#enharmonic;

		return (enh + octave) as NoteSymbol;
	}

	/**
	 * Returns the midi number
	 *
	 * @member m
	 * @memberof Core#Note#
	 * @example 60 // C3
	 * @type {Number}
	 */
	get m(): number {
		return this.#midi;
	}

	/**
	 * Returns the midi number
	 * @member midi
	 * @memberof Core#Note#
	 * @example 60 // C3
	 * @type {Number}
	 */
	get midi(): number {
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
	get f(): number {
		return this.freq;
	}

	/**
	 * Returns the note frequency
	 * @member freq
	 * @memberof Core#Note#
	 * @example 440 // A3
	 * @type {Number}
	 */
	get freq(): number {
		const midi = this.#midi;

		if (this.#freq) {
			return this.#freq;
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
		const enh = this.enharmonic;

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

	clone(): Note {
		return new Note(this.#note, this.#midi);
	}

	toEnharmonic(): Note {
		return new Note(this.enharmonic, this.midi);
	}

	ensureType(type: NoteType): Note {
		return this.#type !== type ? this.toEnharmonic() : this;
	}

	static isNote(note: NoteLike): note is Note {
		return note instanceof Note;
	}

	/**
	 * Returns a note without the accidental
	 *
	 * @function stripAccidental
	 * @memberof Core#Note
	 *
	 * @param {String|Note} note
	 * @return {String} Natural note
	 */
	static stripAccidental(note: NoteLike): DiatonicNote | null {
		if (!note) return null;

		const n = new Note(note);

		return <DiatonicNote>n.note.replace(new RegExp(ACCIDENT_REGEXP), '');
	}

	/**
	 * Position in the {@link Flats} or {@link Sharps} collection
	 * @function position
	 * @memberof Core#Note
	 *
	 * @param {Note} note
	 * @return {number}
	 */
	static position = (note: NoteLike): number => {
		const n = new Note(note);

		return n.isFlat ? Flats.indexOf(n.note as Flat) : Sharps.indexOf(n.note as Sharp);
	};

	/**
	 * Transpose a note by an interval
	 * @function transposeUp
	 * @memberof Core#Note
	 *
	 * @param {Note | NoteSymbol | string} note
	 * @param {String} int interval
	 * @example transpose(C, "5P") // => "G"
	 * @return {String} How many semitones are they apart
	 */
	static transposeUp = (note: NoteLike, int: Interval): NoteSymbol => Note.transpose(note, int, 'add');

	/**
	 * Transpose a note by an interval
	 * @function transposeDown
	 * @memberof Core#Note
	 *
	 * @param {Note | NoteSymbol | string} note
	 * @param {String} int interval
	 * @example transposeDown(C, "5P") // => "F"
	 * @return {String} How many semitones are they apart
	 */
	static transposeDown = (note: NoteLike, int: Interval): NoteSymbol => Note.transpose(note, int, 'subtract');

	/**
	 * Creates a new Note from a given midi octave
	 * @function withOctave
	 * @memberof Core#Note
	 *
	 * @param {number} midi
	 * @return {NoteSymbol}
	 */
	static fromOctave(note: Note | NoteSymbol, octave: number): Note {
		const n = Note.isNote(note) ? note.note : note;

		return new Note(`${n}${octave}`);
	}

	/**
	 * Extract the pitch from midi
	 * @function extractPitch
	 * @memberof Core#Note
	 *
	 * @param {number} midi
	 * @return {NoteSymbol}
	 */
	static extractPitch(midi: number): NoteSymbol {
		if (midi < 0 || midi > 127) {
			throw new Error(`[Note]: <${midi}> isn't a valid midi note number`);
		}

		const octave = findOctave(midi);
		const base = findCMidiByOctave(octave);
		const c = new Note('C', base);

		const semitones = midi - base;
		let interval: Interval | undefined;

		for (const [interv, semit] of Object.entries(Semitones)) {
			if (semit === semitones) {
				interval = interv as Interval;
			}
		}
		return Note.transposeUp(c, interval!);
	}

	/**
	 * Get a range of notes between the interval [low, high]
	 * @function range
	 * @memberof Core#Note
	 *
	 * @param {NoteLike} low
	 * @param {NoteLike} high
	 * @return {NoteSymbol}
	 */
	static range(low: NoteLike, high: NoteLike): Note[] {
		const l = new Note(low);
		const h = new Note(high);

		return Array.from({ length: h.midi - l.midi }).map((_, i) => new Note(l.midi + i).ensureType(NoteType.Sharp));
	}

	static isNoteLike = (note: unknown): note is NoteLike => {
		try {
			new Note(<NoteLike>note);

			return true;
		} catch {
			return false;
		}
	};

	static isNoteSymbol = (note: NoteLike): note is NoteSymbol =>
		!(note instanceof Note) && typeof note !== 'number' && !isPitch(note);

	/**
	 * Tries to find the enharmonic of the note
	 * @private
	 * @param {string} note
	 * @return {String} enharmonic
	 * @memberof Note
	 */
	private resolveEnharmonic(note: NoteSymbol): NoteSymbol {
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
			return note;
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

	private static transpose(note: NoteLike, int: Interval, operation: 'add' | 'subtract'): NoteSymbol {
		const naturalNote = <DiatonicNote>Note.stripAccidental(note);
		let interval = -1;
		let diatonicInterval = -1;

		const semit = Semitones[int];
		const diatonicSemit = parseInt(int.replace(/\D/, ''), 10) - 1;

		if (!semit) {
			return new Note(note).note;
		}

		const n = new Note(note);

		const ringedIntervals = n.isFlat ? ring(Array.from(Flats)) : ring(Array.from(Sharps));
		const posNote = Note.position(n.note);
		const posNaturalNote = DiatonicNotes.indexOf(naturalNote);

		if (operation === 'add') {
			interval = posNote + semit;
			diatonicInterval = posNaturalNote + diatonicSemit;
		}

		if (operation === 'subtract') {
			interval = posNote - semit;
			diatonicInterval = posNaturalNote - diatonicSemit;
		}

		const transposedNote = new Note(ringedIntervals[interval]);
		const transposedNatural = ring(Array.from(DiatonicNotes))[diatonicInterval];

		if (
			!transposedNote.isNatural &&
			Note.stripAccidental(transposedNote.note) !== transposedNatural &&
			isDefined(transposedNote.enharmonic)
		) {
			return transposedNote.enharmonic;
		}

		return transposedNote.note;
	}

	get [Symbol.toStringTag](): string {
		return `Note: ${this.pitch}`;
	}
}
