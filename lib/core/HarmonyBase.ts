import { Octaves } from '../common/types';
import { NoteSymbol } from '../constants';
import { assureNote } from '../utils';
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
abstract class HarmonyBase {
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
		this._root = assureNote(root);

		if (octaves) {
			this._octaves = octaves;
		} else if (this._root.octave) {
			this._octaves = [ this._root.octave, 1 ];
		} else {
			this._octaves = [ 3, 1 ];
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
	 * @memberof Core.Scale#
	 *
	 * @param {Array<Number>} octaves
	 * @return {this}
	 */
	abstract assignOctaves(octaves?: Octaves): this;
}

export default HarmonyBase;
