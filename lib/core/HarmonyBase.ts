import * as R from 'ramda';
import { Octaves } from '../common/types';
import { Interval, NoteSymbol, Semitones } from '../constants';
import { distance } from '../tools';
import { mapNotesToFreq, mapNotesToMidi, mapNotesToString, mapNotesToSymbol } from '../utils/map';
import { Note, NoteLike } from './Note';

/**
 * Abstract base class for harmonic structures
 *
 * @memberof Core
 * @class
 * @name HarmonyBase
 * @abstract
 */
export abstract class HarmonyBase {
	protected _root: Note;
	protected _notes: Note[] = [];
	protected _octaves: Octaves;
	protected _hasFlats = false;
	protected _hasSharps = false;

	/**
	 * Creates an instance of HarmonyBase.
	 *
	 * @constructs HarmonyBase
	 * @memberof Core.HarmonyBase#
	 * @private
	 *
	 * @param {Note} root
	 * @param {Array<Number>} octaves [starting, number of octaves] range of octaves to map notes to
	 */
	constructor(root: NoteLike, octaves?: Octaves) {
		this._root = new Note(root);

		if (octaves) {
			this._octaves = octaves;
		} else if (this._root.octave) {
			this._octaves = [this._root.octave, 1];
		} else {
			this._octaves = [3, 1];
		}
	}

	/**
	 * Gets the root note
	 * @member root
	 * @memberof Core.HarmonyBase#
	 * @example Note('A')
	 *
	 * @type {Note}
	 */
	get root(): Note {
		return this._root;
	}

	/**
	 * Gets the notes in {@link Note} format
	 * @member notes
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<Note>}
	 */
	get notes(): Note[] {
		return this._notes;
	}

	/**
	 * Gets the notes as pitches
	 * @example
	 * new Scale('C', Scale.Major).pitches => [ 'C3', 'D3', 'E3', 'F3', 'G3', 'A3', 'B3' ]
	 * new Chord('Cmaj').pitches => [ 'C3', 'E3', 'G3' ]
	 *
	 * @member pitches
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<string>}
	 */
	get pitches(): string[] {
		if (!this._notes.length) {
			return [];
		}

		return mapNotesToString(this._notes);
	}

	/**
	 * Gets the notes as string
	 * @example
	 * new Scale('C', Scale.Major).noteSymbols => [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ]
	 * new Chord('Cmaj').noteSymbols => [ 'C', 'E', 'G' ]
	 *
	 * @member noteSymbols
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<string>}
	 */
	get noteSymbols(): NoteSymbol[] {
		if (!this._notes.length) {
			return [];
		}

		return mapNotesToSymbol(this._notes);
	}

	/**
	 * Gets the notes in midi format
	 * @example
	 * new Scale('C', Scale.Major).midi => [ 60, 62, 64, 65, 67, 69, 71 ]
	 * new Chord('Cmaj').midi => [ 60, 64, 67 ]
	 *
	 * @member midi
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<number>}
	 */
	get midi(): number[] {
		if (!this._notes.length) {
			return [];
		}

		return mapNotesToMidi(this._notes);
	}

	/**
	 * Gets the notes as frequencies
	 * @example
	 * new Scale('C', Scale.Major).freq => [ 261.62, 293.66, 329.62, 349.22, 391.99, 440, 493.88 ]
	 * new Chord('Cmaj').freq => [261.62, 329.62, 391.99]
	 *
	 * @member freq
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {Array<number>}
	 */
	get freq(): number[] {
		if (!this.notes.length) {
			return [];
		}

		return mapNotesToFreq(this._notes);
	}

	get octaves(): Octaves {
		return this._octaves;
	}

	/**
	 * Octaves getter/setter
	 * @member {Array<Number>} octaves
	 * @memberof Core.HarmonyBase#
	 * @param {Array} octaves
	 */
	set octaves(octaves: Octaves) {
		if (octaves !== this._octaves) {
			this.assignOctaves(octaves);
		}
	}

	/**
	 * Does it use flats
	 * @member hasFlats
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {boolean}
	 */
	get hasFlats(): boolean {
		return this._hasFlats;
	}

	/**
	 * Does it use sharps
	 * @member hasSharps
	 * @memberof Core.HarmonyBase#
	 *
	 * @type {boolean}
	 */
	get hasSharps(): boolean {
		return this._hasSharps;
	}

	/**
	 * Assigns a new octave range - [ 3, 1 ]
	 *
	 * @private
	 * @function assignOctaves
	 * @memberof Core.HarmonyBase#
	 *
	 * @param {Array<Number>} octaves
	 * @return {this}
	 */
	abstract assignOctaves(octaves?: Octaves): this;

	/**
	 * Transforms the intervals into notes
	 *
	 * @private
	 * @function createNotes
	 * @memberof Core.HarmonyBase#
	 *
	 * @return {Array<Note>}
	 */
	protected createNotes(intervals: Interval[]) {
		const rootNote = this.root;
		const notes = [rootNote];

		for (let index = 0; index < intervals.length; index++) {
			const interval = intervals[index] as Interval;
			const semit = Semitones[interval];

			if (semit) {
				notes.push(new Note(distance.transposeUp(rootNote, interval), rootNote.midi + semit));
			}
		}

		if (R.length(R.filter((n) => n.isNatural, notes)) === notes.length) {
			this._notes = notes;
			return;
		}

		const sharps = notes.map((note) => (note.isNatural || note.isSharp ? note : note.toEnharmonic())) as Note[];
		const flats = notes.map((note) => (note.isNatural || note.isFlat ? note : note.toEnharmonic())) as Note[];

		// This is to figure out if flats is a better match than sharps when the root note is natural
		const naturalNotesLenSharp = R.length(R.uniqBy(Note.stripAccidental, sharps));
		const naturalNotesLenFlat = R.length(R.uniqBy(Note.stripAccidental, flats));

		if (
			rootNote.isFlat ||
			naturalNotesLenFlat > naturalNotesLenSharp ||
			(naturalNotesLenFlat === naturalNotesLenSharp &&
				R.length(R.filter((n) => n.isFlat, notes)) > R.length(R.filter((n) => n.isSharp, notes)))
		) {
			this._hasFlats = true;
			this._hasSharps = false;

			this._notes = flats;
		} else if (naturalNotesLenSharp > 0 && naturalNotesLenSharp > notes.length) {
			this._hasSharps = true;
			this._hasFlats = false;

			this._notes = sharps;
		} else {
			this._notes = notes;
		}
	}
}
