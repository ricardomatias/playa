import * as R from 'ramda';
import HarmonyBase from './HarmonyBase';
import { Note } from './Note';
import {
	ChordSymbol,
	ChordStructure,
	ChordStructures,
	ChordDefinition,
	ChordName,
	ChordIntervals, Interval, Semitones,
} from '../constants';
import { deconstructName } from './utils';
import { natural, PlayaError, whilst } from '../utils';
import { distance, rotate, Random, choose } from '../tools';
import { ChordDescriptor } from './Types';
import { isDefined, isString, isUndefined } from '../utils/types-guards';
import assignOctaves from '../utils/octaves';
import { Scale } from './Scale';
import { Octaves } from '../common/types';


/**
 * Defines a Chord
 *
 * @class
 * @memberof Core#
 *
 * @name Chord
 * @augments HarmonyBase
 */
export class Chord extends HarmonyBase {
	private _name: ChordName | undefined;
	private _symbol: ChordSymbol | undefined;
	private _intervals: ChordIntervals | undefined;
	private _chordName: string | undefined;
	private _structure: ChordStructure | undefined;

	/**
	* Chord symbols used to create chords
	*
	* @member Symbols
	* @memberof Core#Chord
	* @enum
	* @param {ChordName} ChordName
	* @static
	* @type {ChordSymbol}
	*
	* @example Symbols.Major => 'maj'
	*/
	static Symbols = ChordSymbol

	/**
	* Chord structures used to create chords
	*
	* @member Structures
	* @memberof Core#Chord
	* @enum
	* @static
	* @type {ChordStructure}
	*
	* @example Structures.Sixth => [ 4, [ '1 3 5 6' ] ]
	*/
	static Structures = ChordStructure

	/**
	 * @constructs Chord
	 * @memberof Core#
	 *
	 * @param {String | Object} chord - a chord name f.ex: 'Am7'
	 * @param {Object} [chord.root] - f.ex: A
	 * @param {ScaleIntervals|string} [chord.intervals] - f.ex: Scale.Dorian
	 * @param {ChordStructure} [chord.structure] - f.ex: Chord.Structures.Sixth
	 * @param {Array<Number>} [octaves = [ 3, 1]] [starting, number of octaves] range of octaves to map notes to
	 *
	 * @example
	 * new Chord('Am6');
	 * new Chord({ root: 'A', intervals: Scale.Dorian, structure: Chord.Sructures.Sixth  });
	 */
	constructor(chord: string | ChordDescriptor, octaves: Octaves = [ 3, 1 ]) {
		const {
			root,
			name,
			symbol,
			structure,
			intervals,
		} = isString(chord) ? deconstructName(chord) : chord;

		if (isUndefined(root)) {
			throw new PlayaError('Chord', `Could not recognize <${root}> as a valid root`);
		}

		// !THIS NEEDS TO BE CALLED HERE
		super(root, octaves);

		this._name = name;
		this._symbol = symbol;
		this._structure = structure;

		if (isString(chord)) {
			this._chordName = chord;
		}

		if (this._name && R.is(String, chord)) {
			const notes = this.createChord();

			if (isUndefined(notes)) {
				throw new PlayaError('Chord', `Could not recognize <${chord}> as a valid chord`);
			}

			this._notes = notes;

			this.discoverAccident();
		} else if (isDefined(intervals)) {
			this._notes = this.createChordByStructure(intervals as ChordIntervals, structure);
		}

		if (!this._notes.length) {
			if (!isString(chord)) {
				throw new PlayaError('Chord', `Could not create <${JSON.stringify(chord)}>`);
			} else {
				throw new PlayaError('Chord', `Could not create <${chord}>`);
			}
		}

		this.assignOctaves();
	}

	/**
	* Returns the chord's name
	*
	* @member name
	* @memberof Core#Chord#
	* @type {string}
	* @example 'Asus2'
	* @readonly
	*/
	get name(): string | undefined {
		return this._chordName;
	}


	/**
	* Returns the chord's symbol
	*
	* @example
	* 'Asus2' => sus2
	* @member symbol
	* @memberof Core#Chord#
	* @type {ChordSymbol}
	* @readonly
	*/
	get symbol(): ChordSymbol | undefined {
		return this._symbol;
	}

	/**
	* Returns the chord's structure
	*
	* @example
	* 'G7' => [ 4, ['1 3 5 7'] ]
	* @member structure
	* @memberof Core#Chord#
	* @type {ChordStructure}
	* @readonly
	*/
	get structure(): ChordStructure | undefined {
		return this._structure;
	}

	/**
	* Returns the chord's intervals
	*
	* @example
	* 'G7' => '1P 3M 5P 7m'
	* @member intervals
	* @memberof Core#Chord#
	* @type {ChordStructure}
	* @readonly
	*/
	get intervals(): ChordIntervals | undefined {
		return this._intervals;
	}

	/**
	 * Inverts the chord's structure by mutating the current class
	 *
	 * @function invert
	 * @memberof Core#Chord#
	 * @param {number} nrOfTimes number of times
	 *
	 * @example
	 * new Chord('Am').invert(1) => [ 'C3', 'E3', 'A3' ]
	 * new Chord('Am').invert(2) => [ 'E3', 'A3', 'C4' ]
	 */
	invert(nrOfTimes?: number): void {
		this._notes = rotate(this._notes, nrOfTimes || Random.int(R.length(this._notes), 1));

		this.assignOctaves();
	}

	/**
	* Note at interval
	* @example
	* new Chord('Am').noteAt(5) => E
	*
	* @function noteAt
	* @memberof Core#Chord#
	* @param {number} interval
	* @return {Note}
	*/
	noteAt(interval: number): Note {
		// !TODO: Migrate away from structure and just use the chord intervals

		if (isUndefined(this._structure)) {
			throw new PlayaError('Chord', 'Cannot grab the note');
		}

		const structures = this._structure[1];
		let defaultIntervals = R.head(structures) as string;

		if (this._symbol === ChordSymbol.Sus4) {
			defaultIntervals = R.nth(1, structures) as string;
		}

		const intervals = R.map(parseInt, defaultIntervals.split(' '));
		const noteIndex = intervals.indexOf(interval);

		if (noteIndex === -1) {
			throw new PlayaError('Chord', `[${intervals}] structure doesn't contain interval: ${interval}`);
		}

		return this._notes[noteIndex];
	}

	/**
	 * Assigns a new octave range - [ 3, 1 ]
	 *
	 * @private
	 * @function assignOctaves
	 * @memberof Core.Scale#
	 *
	 * @param {Array<Number>} octaves
	 */
	assignOctaves(octaves?: Octaves): void {
		if (octaves) {
			this._octaves = octaves;
		}

		this._notes = assignOctaves(this._notes, this.octaves, { type: 'chord', hasFlats: this.hasFlats });
	}

	/**
	 *	Used for creating chords by name
	 *
	 * @private
	 */
	private discoverAccident() {
		const notes = this._notes;
		const rootNote = new Note(this.root);

		// This is to figure out if flats is a better match than sharps when the root note is natural
		const naturalNotesLenSharp = R.length(R.uniqBy((note) => natural(note), notes));
		const naturalNotesLenFlat = R.length(R.uniqBy((note) => natural(note), notes));

		if (rootNote.isFlat) {
			this._hasFlats = true;
		}

		if (rootNote.isSharp) {
			this._hasSharps = true;
		}

		// TODO: refactor this since this preference for sharps is not justifiable
		if (naturalNotesLenSharp >= naturalNotesLenFlat) {
			this._hasSharps = true;
		} else {
			this._hasFlats = true;
		}
	}

	/**
	 * Creates a chord based on a chordName f.ex: Am7
	 *
	 * @private
	 * @param {String} chordName
	 * @return {Array<Note>}
	 */
	private createChord(): Note[] | undefined {
		const root = this._root;

		if (isUndefined(this._name)) {
			return;
		}

		this._intervals = ChordDefinition[this._name].intervals;

		const intervals = <Interval[]> this._intervals.split(' ');

		const notes = [ new Note(root) ];

		for (let idx = 1; idx < intervals.length; idx++) {
			const interval = intervals[idx];

			const note = distance.transposeUp(root, interval) as string;

			notes.push(new Note(note));
		}


		return notes;
	}

	/**
	 * Creates a chord based on a chordName f.ex: Am7
	 *
	 * @private
	 *
	 * @param {String} intervals
	 * @param {ChordStructure} structure
	 * @return {Array<Note>}
	 */
	private createChordByStructure(intervals: ChordIntervals, structure: ChordStructure = ChordStructure.Triad) {
		const root = this.root;
		const chordIntervalsArray = intervals.split(' ') as Interval[];
		const intervalsValidation = chordIntervalsArray.map((interval) => typeof Semitones[interval] !== 'undefined');

		if (intervalsValidation.includes(false)) {
			throw new PlayaError('Chord', `[${intervals}] has unrecognized intervals.`);
		}

		const [ nrOfNotes, defaultIntervals ] = structure;

		const structureIntervals = defaultIntervals.length === 1 ? defaultIntervals[0] : choose(Array.from(defaultIntervals));
		const structureIntervalsArray = structureIntervals.split(' ');

		const scale = new Scale(root, intervals as string);

		this._hasFlats = scale.hasFlats;
		this._hasSharps = scale.hasSharps;

		let {
			chordNotes, chordIntervals,
		} = this.createFromScale(scale, chordIntervalsArray, nrOfNotes, structureIntervalsArray);

		// if the provided scale doesn't have the default intervals from the given structure
		// try other chord types from the same type of structure
		if (chordIntervals.length !== nrOfNotes) {
			const fromDiffChords = this.createFromDiffChords(structure, scale, chordIntervalsArray, nrOfNotes);

			if (isUndefined(fromDiffChords)) {
				return [];
			}

			chordNotes = fromDiffChords.chordNotes;
			chordIntervals = fromDiffChords.chordIntervals;
		}

		if (!chordIntervals) {
			return [];
		}

		const chord = chordIntervals.join(' ') as ChordIntervals;

		this._intervals = chord;
		this._symbol = Chord.findChordSymbols(chord) as ChordSymbol;

		this._structure = structure;
		this._chordName = `${root}${this._symbol}`;

		return chordNotes;
	}

	private createFromScale(
		scale: Scale, chordIntervalsArray: Interval[], nrOfNotes: number, structureIntervalsArray: string[],
	): { chordNotes: Note[], chordIntervals: Interval[] } {
		const chordNotes: Note[] = [];
		const chordIntervals: Interval[] = [];
		const notes = scale.notes;

		for (let index = 0; index < nrOfNotes; index++) {
			const dist = structureIntervalsArray[index];

			let interval = R.find(R.includes(dist), chordIntervalsArray);
			let noteIndex: number;
			let note: Note;

			if (isUndefined(interval) || chordIntervalsArray.indexOf(interval) === -1) {
				const newDist = `${(parseInt(dist, 10) - 7)}`;
				const newInterval = R.find(R.includes(newDist), chordIntervalsArray);

				if (isUndefined(newInterval)) {
					continue;
				}

				noteIndex = chordIntervalsArray.indexOf(newInterval);

				if (!notes[noteIndex]) {
					continue;
				}

				note = notes[noteIndex];
				interval = dist + newInterval.split('')[1] as Interval;
			} else {
				noteIndex = chordIntervalsArray.indexOf(interval as Interval);
				note = notes[noteIndex];
			}

			chordNotes.push(note);
			chordIntervals.push(interval);
		}

		return { chordNotes, chordIntervals };
	}

	private createFromDiffChords(
		structure: ChordStructure, scale: Scale, scaleIntervals: Interval[], nrOfNotes: number,
	): { chordNotes: Note[], chordIntervals: Interval[] } | undefined {
		const compatibleChordNames = <ChordName[]>ChordStructures.get(structure);
		let chordIntervals: Interval[] | undefined;
		let chordNotes: Note[] | undefined;
		let structureIntervalsArray: string[];

		for (let index = 0; index < compatibleChordNames.length; index++) {
			const name = compatibleChordNames[index];
			const chord = ChordDefinition[name];

			structureIntervalsArray = chord.intervals
				.split(' ')
				.map((interval) => interval.replace(/\D/, ''));

			const fromScale = this.createFromScale(
				scale,
				scaleIntervals,
				nrOfNotes,
				// transform intervals to structure[]
				structureIntervalsArray,
			);

			chordIntervals = fromScale.chordIntervals;
			chordNotes = fromScale.chordNotes;

			if (chordIntervals.length === nrOfNotes) {
				break;
			}
		}

		if (isUndefined(chordNotes) || isUndefined(chordIntervals)) {
			return;
		}

		return { chordNotes, chordIntervals };
	}

	/**
	 * Finds the most suitable chord symbols for this chord
	 * @function findChordSymbols
	 * @memberof Core#Chord
	 * @static
	 *
	 * @example findChordSymbols('1P 3M 5P') => 'maj'
	 * @param {String} chord
	 * @return {ChordSymbol|string} chord
	 */
	static findChordSymbols(chord: ChordIntervals | string): ChordSymbol | string | undefined {
		let chordType: ChordSymbol | string | undefined;
		const chordIntervals = Object.entries(ChordIntervals);

		for (const [ name, symbol ] of chordIntervals) {
			// if (chordType) { // this is so we don't get the empty major
			// 	break;
			// }

			if (symbol === chord) {
				chordType = ChordSymbol[name as ChordName];
				break;
			}
		}

		if (isDefined(chordType)) {
			return chordType;
		}

		let intervals = chord.split(' ');
		const last = R.last(intervals) as string;

		try {
			whilst(() => {
				intervals = R.take(intervals.length - 1, intervals);
				const tempChord = intervals.join(' ');

				for (const [ name, symbol ] of chordIntervals) {
					if (symbol === tempChord) {
						chordType = ChordSymbol[name as ChordName];
					}
				}
			}, () => (!chordType));

			chordType = `${chordType}add${last.replace(/\D/g, '')}`;
		} catch (error) {
			return;
		}

		return chordType;
	}
}


