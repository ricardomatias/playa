import * as R from 'ramda';
import HarmonyBase from './HarmonyBase';
import { Note } from './Note';
import {
	ChordSymbol,
	ChordStructure,
	ChordStructures,
	ChordDefinition,
	ChordName,
	ChordIntervals,
} from '../constants/chords';
import { Interval, Semitones } from '../constants/intervals';
import { NoteSymbol } from '../constants/note';
import { deconstructName, findNameFromIntervals, findNameFromSymbol } from './utils';
import { PlayaError, whilst } from '../utils';
import { distance, rotate, Random, choose } from '../tools';
import { isDefined, isNull, isUndefined } from '../utils/types-guards';
import assignOctaves from '../utils/octaves';
import { Scale } from './Scale';
import { Octaves } from '../common/types';
import { ScaleIntervals } from '../constants';


type ChordOptions = Partial<{ symbol: ChordSymbol, intervals: ChordIntervals, structure: ChordStructure }>

function isChordIntervals(argument: ChordSymbol | ChordIntervals): argument is ChordIntervals {
	return Object.keys(Semitones).includes(argument.split(' ')[0]);
}

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
	* @example Chord.Symbols.Major => 'maj'
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
	* @example Chord.Structures.Sixth => [ '1 3 5 6' ]
	*/
	static Structures = ChordStructure

	/**
	 * @constructs Chord
	 * @memberof Core#
	 *
	 * @param {NoteSymbol} root note
	 * @param {ChordSymbol | ChordIntervals} description f.ex: 'm' (for Minor) or '1P 3m 5P'
	 * @param {Array<Number>} [octaves = [ 3, 1]] [starting, number of octaves] range of octaves to map notes to
	 *
	 *
	 * @example
	 * new Chord('A', 'maj');
	 * new Chord('A', '1P 3M 5P', [4, 1]);
	 *
	 * Chord.fromName('Am7')
	 * Chord.fromIntervals('A', Scale.Intervals.Minor, Chord.Structures.Triad) => 'Am'
	 */
	constructor(
		root: NoteSymbol,
		description: ChordSymbol | ChordIntervals,
		octaves: Octaves = [ 3, 1 ],
		{ intervals, symbol, structure }: ChordOptions = {},
	) {
		super(root, octaves);

		this._symbol = symbol;
		this._intervals = intervals;
		this._structure = structure;

		if (isChordIntervals(description)) {
			this._intervals = description;
			this._name = findNameFromIntervals(this._intervals);
		} else {
			this._symbol = description;
			this._name = findNameFromSymbol(this._symbol);
		}

		if (isUndefined(this._name)) {
			if (isUndefined(this._intervals)) {
				throw new PlayaError('Chord', `Could not recognize <${description}> as a valid chord description`);
			}
		} else {
			const chordDefinition = ChordDefinition[this._name];

			this._structure = chordDefinition.structure;

			if (isUndefined(this._symbol)) this._symbol = chordDefinition.symbol;
			if (isUndefined(this._intervals)) this._intervals = chordDefinition.intervals;
		}

		this._chordName = `${root}${this._symbol}`;

		const notes = this.createChord();

		if (isUndefined(notes) || !notes.length) {
			throw new PlayaError('Chord', `Could create chord with <${description}>`);
		}

		this._notes = notes;

		this.discoverAccident();

		this.assignOctaves();
	}

	/**
	* Create a chord from a Scale's intervals
	* @function fromName
	* @memberof Core#Chord
	* @static
	* @example Chord.fromName('Am6');
	*
	* @param {string} chord
	* @param {Octaves} [octaves = [ 3, 1]]
	* @return {Chord} chord
	*/
	static fromName(chord: string, octaves?: Octaves): Chord {
		const {
			root,
			symbol,
		} = deconstructName(chord);

		if (isUndefined(root) || isUndefined(symbol)) {
			throw new PlayaError('Chord', `Could not recognize <${root}> <${symbol}> as a valid chord`);
		}

		return new Chord(root, symbol, octaves);
	}

	/**
	* Create a chord from a Scale's intervals
	* @function fromIntervals
	* @memberof Core#Chord
	* @static
	* @example Chord.fromIntervals('A', Scale.Intervals.Dorian, Chord.Sructures.Sixth);
	*
	* @param {NoteSymbol} root
	* @param {ScaleIntervals | string} intervals
	* @param {ChordStructure} [structure = ChordStructure.Triad]
	* @param {Octaves} [octaves = [ 3, 1]]
	* @return {Chord} chord
	*/
	static fromIntervals(
		root: NoteSymbol,
		intervals: ScaleIntervals | string,
		structure: ChordStructure | string[] = ChordStructure.Triad,
		octaves?: Octaves,
	): Chord {
		const chordInfo = createChordWithStructure(root, intervals, structure as ChordStructure);

		if (isNull(chordInfo)) {
			throw new PlayaError('Chord', `Could not recognize <${root}> <${intervals}> as a valid chord`);
		}

		const { symbol, chordIntervals, chordStructure } = chordInfo;

		return new Chord(root, symbol, octaves, { intervals: chordIntervals, structure: chordStructure });
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
	* 'G7' => ['1 3 5 7']
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
	* @param {number} position
	* @return {Note}
	*/
	noteAt(position: number): Note {
		// !TODO: Migrate away from structure and just use the chord intervals

		if (isUndefined(this._structure)) {
			throw new PlayaError('Chord', 'Cannot grab the note');
		}

		const structures = this._structure;
		let defaultIntervals = R.head(structures) as string;

		if (this._symbol === ChordSymbol.Sus4) {
			defaultIntervals = R.nth(1, structures) as string;
		}

		const intervals = R.map(parseInt, defaultIntervals.split(' '));
		const noteIndex = intervals.indexOf(position);

		if (noteIndex === -1) {
			throw new PlayaError('Chord', `[${intervals}] structure doesn't contain position: ${position}`);
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
		const sharpNotes = R.length(R.filter(R.prop('isSharp'), notes));
		const flatNotes = R.length(R.filter(R.prop('isFlat'), notes));

		if (rootNote.isFlat || flatNotes > 0) {
			this._hasFlats = true;
		}

		if (rootNote.isSharp || sharpNotes > 0) {
			this._hasSharps = true;
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

		// this._intervals will exist in `fromScale`
		if (isDefined(this._name)) {
			this._intervals = ChordDefinition[this._name].intervals;
		}

		if (isUndefined(this._intervals)) {
			return;
		}

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
	 * Finds the most suitable chord symbols for this chord
	 * @function findChordSymbol
	 * @memberof Core#Chord
	 * @static
	 *
	 * @example findChordSymbols('1P 3M 5P') => 'maj'
	 * @param {String} chord
	 * @return {ChordSymbol|string} chord
	 */
	static findChordSymbol(chord: ChordIntervals | string): ChordSymbol | string | undefined {
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

export const createFromScale = (
	scale: Scale, chordIntervalsArray: Interval[], nrOfNotes: number, structureIntervalsArray: string[],
): { chordIntervals: Interval[] } => {
	const chordIntervals: Interval[] = [];
	const notes = scale.notes;

	for (let index = 0; index < nrOfNotes; index++) {
		const dist = structureIntervalsArray[index];

		let interval = R.find(R.includes(dist), chordIntervalsArray);
		let noteIndex: number;

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

			interval = dist + newInterval.split('')[1] as Interval;
		} else {
			noteIndex = chordIntervalsArray.indexOf(interval as Interval);
		}

		chordIntervals.push(interval);
	}

	return { chordIntervals };
};


export const createFromStructure = (
	structure: ChordStructure, scale: Scale, scaleIntervals: Interval[], nrOfNotes: number,
): { chordIntervals: Interval[] } | undefined => {
	const compatibleChordNames = <ChordName[]>ChordStructures.get(structure);
	let chordIntervals: Interval[] | undefined;
	let structureIntervalsArray: string[];

	for (let index = 0; index < compatibleChordNames.length; index++) {
		const name = compatibleChordNames[index];
		const chord = ChordDefinition[name];

		structureIntervalsArray = chord.intervals
			.split(' ')
			.map((interval) => interval.replace(/\D/, ''));

		const fromScale = createFromScale(
			scale,
			scaleIntervals,
			nrOfNotes,
			// transform intervals to structure[]
			structureIntervalsArray,
		);

		chordIntervals = fromScale.chordIntervals;

		if (chordIntervals.length === nrOfNotes) {
			break;
		}
	}

	if (isUndefined(chordIntervals)) {
		return;
	}

	return { chordIntervals };
};

/**
 * Creates a chord based on a chordName f.ex: Am7
 *
 * @private
 *
 * @param {NoteSymbol} root
 * @param {String} intervals
 * @param {ChordStructure} structure
 * @return {Array<Note>}
 */
const createChordWithStructure = (
	root: NoteSymbol,
	intervals: ScaleIntervals | string,
	structure: ChordStructure,
): { symbol: ChordSymbol, chordIntervals: ChordIntervals, chordStructure: ChordStructure } | null => {
	const chordIntervalsArray = intervals.split(' ') as Interval[];
	const intervalsValidation = chordIntervalsArray.map((interval) => typeof Semitones[interval] !== 'undefined');

	if (intervalsValidation.includes(false)) {
		throw new PlayaError('Chord', `[${intervals}] has unrecognized intervals.`);
	}

	const defaultIntervals = structure;

	const structureIntervals = defaultIntervals.length === 1 ? defaultIntervals[0] : choose(Array.from(defaultIntervals));
	const structureIntervalsArray = structureIntervals.split(' ');
	const nrOfNotes = structureIntervalsArray.length;

	const scale = new Scale(root as NoteSymbol, intervals as string);

	let {
		chordIntervals,
	} = createFromScale(scale, chordIntervalsArray, nrOfNotes, structureIntervalsArray);

	// if the provided scale doesn't have the default intervals from the given structure
	// try other chord types from the same type of structure
	if (chordIntervals.length !== nrOfNotes) {
		const fromDiffChords = createFromStructure(structure, scale, chordIntervalsArray, nrOfNotes);

		if (isUndefined(fromDiffChords)) {
			return null;
		}

		chordIntervals = fromDiffChords.chordIntervals;
	}

	if (!chordIntervals) {
		return null;
	}

	const chord = chordIntervals.join(' ') as ChordIntervals;
	const symbol = Chord.findChordSymbol(chord) as ChordSymbol;

	return {
		chordIntervals: chord,
		chordStructure: structure,
		// name: `${root}${symbol}`,
		symbol,
		// chordNotes,
	};
};
