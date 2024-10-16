import * as R from 'ramda';
import { roll } from '@ricardomatias/roll';

import { HarmonyBase } from './HarmonyBase';
import { Note, NoteLike, NoteType } from './Note';
import {
	ChordSymbol,
	ChordStructure,
	SimilarChordsByStructure,
	ChordDefinition,
	ChordName,
	ChordIntervals,
	ChordIntervalRelations,
} from '../constants/chords';
import { HarmonicPosition, Interval, Semitones } from '../constants/intervals';
import { NoteSymbol } from '../constants/note';
import { ScaleIntervals } from '../constants/scales';
import { deconstructName, findNameFromIntervals, findNameFromSymbol } from './utils';
import { PlayaError, whilst } from '../utils';
import { rotate, choose, random, interval } from '../tools';
import { isDefined, isNull, isUndefined } from '../utils/types-guards';
import assignOctaves from '../utils/octaves';
import { Scale } from './Scale';
import { Octaves } from '../common/types';

type ChordOptions = Partial<{ symbol: ChordSymbol; intervals: ChordIntervals; structure: ChordStructure }>;

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
	private _intervals: ChordIntervals;
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
	static Symbols = ChordSymbol;

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
	static Structures = ChordStructure;

	/**
	 * Chord structures used to create chords
	 *
	 * @member Intervals
	 * @memberof Core#Chord
	 * @enum
	 * @static
	 * @type {ChordIntervals}
	 *
	 * @example Chord.Intervals.Major => '1P 3M 5P'
	 */
	static Intervals = ChordIntervals;

	/**
	 * @constructs Chord
	 * @memberof Core#
	 *
	 * @param {NoteLike} root note
	 * @param {ChordSymbol | ChordIntervals} description f.ex: 'm' (for Minor) or '1P 3m 5P'
	 * @param {Array<Number>} [octaves = [ 3, 1]] [starting, number of octaves] range of octaves to map notes to
	 *
	 *
	 * @example
	 * new Chord('A', 'maj'); // new Chord('A', Chord.Symbols.Major)
	 * new Chord('A', '1P 3M 5P', [4, 1]); // new Chord('A', Chord.Intervals.Major, [4, 1])
	 *
	 * Chord.fromName('Am7')
	 * Chord.fromIntervals('A', Scale.Intervals.Minor, Chord.Structures.Triad) => 'Am'
	 */
	constructor(
		root: NoteLike,
		description: ChordSymbol | ChordIntervals,
		octaves?: Octaves,
		{ intervals, symbol, structure }: ChordOptions = {}
	) {
		super(root, octaves);

		this._symbol = symbol;
		this._structure = structure;
		let _intervals = intervals;

		if (isDefined(description)) {
			if (isChordIntervals(description)) {
				_intervals = description;
				this._name = findNameFromIntervals(_intervals);
			} else {
				this._symbol = description;
				this._name = findNameFromSymbol(this._symbol);
			}
		}

		if (isUndefined(this._name)) {
			if (isUndefined(_intervals)) {
				throw new PlayaError('Chord', `Could not recognize <${description}> as a valid chord description`);
			} else {
				this._intervals = _intervals;

				const sym = Chord.findChordSymbol(this._intervals);

				if (isDefined(sym)) this._chordName = `${this._root.note}${sym}`;
			}
		} else {
			const chordDefinition = ChordDefinition[this._name];

			this._structure = chordDefinition.structure;

			if (isUndefined(this._symbol)) this._symbol = chordDefinition.symbol;
			this._intervals = chordDefinition.intervals;

			this._chordName = `${this._root.note}${this._symbol}`;
		}

		this.createChord(description);
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
		const { root, symbol } = deconstructName(chord);

		if (isUndefined(root) || isUndefined(symbol)) {
			throw new PlayaError('Chord', `Could not recognize <${root}> <${symbol}> as a valid chord`);
		}

		return new Chord(root, symbol, octaves);
	}

	/**
	 * Create a chord from a Scale's intervals.
	 * This may not always generate the same chord.
	 *
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
		octaves?: Octaves
	): Chord {
		const chordInfo = createChordWithStructure(root, intervals, structure as ChordStructure);

		if (isNull(chordInfo)) {
			throw new PlayaError('Chord', `Could not recognize <${root}> <${intervals}> as a valid chord`);
		}

		const { symbol, chordIntervals, chordStructure } = chordInfo;

		return new Chord(root, chordIntervals, octaves, { symbol, structure: chordStructure });
	}

	/**
	 * Create a chord from a Scale's intervals
	 * @function fromNotes
	 * @memberof Core#Chord
	 * @static
	 * @example Chord.fromNotes(['A', 'C', 'E', 'G'])
	 *
	 * @param {Array<NoteSymbol>} notes
	 * @param {Octaves} [octaves = [ 3, 1]]
	 * @return {Chord} chord
	 */
	static fromNotes(notes: NoteSymbol[], octaves?: Octaves): Chord {
		const root = notes[0];
		const intervalsArray = R.tail(notes.map((note) => interval.between(root, note)));

		if (intervalsArray.includes(null)) {
			throw new PlayaError('Chord', `Could not recognize a valid chord from these notes: <${notes}>`);
		}

		const intervals = `1P ${intervalsArray.join(' ')}`;
		const symbol = this.findChordSymbol(intervals) as ChordSymbol | undefined;

		return new Chord(root, intervals as ChordIntervals, octaves, { symbol });
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
	get intervals(): ChordIntervals {
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
	 * @return {this} this
	 */
	invert(nrOfTimes = 1): this {
		this._notes = rotate(this._notes, nrOfTimes);

		this.assignOctaves();

		return this;
	}

	/**
	 * Note at interval
	 * @example
	 * new Chord('A', 'm7').noteAt(5) => E
	 *
	 * @function noteAt
	 * @memberof Core#Scale#
	 * @param {HarmonicPosition} position
	 * @return {Note}
	 */
	noteAt(position: HarmonicPosition): Note {
		const intervals = this._intervals?.split(' ').map((interv) => parseInt(interv.replace(/[^\d]/, ''))) ?? [];

		const noteIndex = intervals.indexOf(position);

		if (noteIndex === -1) {
			throw new PlayaError('Chord', `[${intervals}] structure doesn't contain position: ${position}`);
		}

		return this.notes[noteIndex];
	}

	/**
	 * Assigns a new octave range - [ 3, 1 ]
	 *
	 * @private
	 * @function assignOctaves
	 * @memberof Core.Scale#
	 *
	 * @param {Array<Number>} octaves
	 * @return {this} this
	 */
	assignOctaves(octaves?: Octaves): this {
		if (octaves) {
			this._octaves = octaves;
		}

		this._notes = assignOctaves(this._notes, this.octaves);

		return this;
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
		let intervals = chord.split(' ') as Interval[];

		for (const [name, symbol] of chordIntervals) {
			const splitSymbol = symbol.split(' ') as Interval[];

			// figure out if all the intervals are present in the symbol
			const allIntervals = R.all((interval) => R.includes(interval, splitSymbol), intervals);

			if (allIntervals) {
				chordType = ChordSymbol[name as ChordName];
				break;
			}
		}

		if (isDefined(chordType)) {
			return chordType;
		}

		const last = R.last(intervals) as string;

		try {
			whilst(
				() => {
					intervals = R.take(intervals.length - 1, intervals);
					const tempChord = intervals.join(' ');

					for (const [name, symbol] of chordIntervals) {
						if (symbol === tempChord) {
							chordType = ChordSymbol[name as ChordName];
						}
					}
				},
				() => !chordType
			);

			chordType = `${chordType}add${last.replace(/\D/g, '')}`;
		} catch {
			intervals = chord.split(' ') as Interval[];

			const state: Record<string, Interval | null> = {
				second: null,
				third: null,
				fourth: null,
				fifth: null,
				sixth: null,
				seventh: null,
				ninth: null,
				eleventh: null,
				thirteenth: null,
			};

			// verify state
			intervals.forEach((interval) => {
				if (['2m', '2M'].includes(interval)) {
					state.second = interval;
				} else if (['3m', '3M'].includes(interval)) {
					state.third = interval;
				} else if (['4P'].includes(interval)) {
					state.fourth = interval;
				} else if (['4A', '5d', '5P', '5A'].includes(interval)) {
					state.fifth = interval;
				} else if (['6m', '6M'].includes(interval)) {
					state.sixth = interval;
				} else if (['7m', '7M'].includes(interval)) {
					state.seventh = interval;
				} else if (['9m', '9M'].includes(interval)) {
					state.ninth = interval;
				} else if (['11P', '11A'].includes(interval)) {
					state.eleventh = interval;
				} else if (['13m', '13M'].includes(interval)) {
					state.thirteenth = interval;
				}
			});

			const altered: string[] = [];

			chordType = '';

			// check thirds
			if (state.third) {
				chordType = ChordIntervalRelations[state.third];
			}

			if (state.second) {
				if (state.second === '2m') {
					altered.push(ChordIntervalRelations[state.second]);
				} else {
					chordType = `${chordType}${ChordIntervalRelations[state.second]}`;
				}
			}

			if (state.fourth) {
				chordType = `${chordType}${ChordIntervalRelations[state.fourth]}`;
			}

			if (state.fifth) {
				if (['4A', '5d'].includes(state.fifth)) {
					if (!state.third) {
						altered.push('#11');
					} else {
						chordType = `${chordType}${ChordIntervalRelations[state.fifth]}`;
					}
				}
			}

			if (state.sixth) {
				if (state.seventh) {
					state.thirteenth = interval.fromSemitones(Semitones[state.sixth] + 12) as any as Interval;
				} else {
					chordType = `${chordType}${ChordIntervalRelations[state.sixth]}`;
				}
			}

			const hasTriad = !!state.third || !!state.fifth;
			const hasExtensions = !!state.ninth || !!state.eleventh || !!state.thirteenth;
			let hasSeventh = false;

			if (state.seventh) {
				if ((hasTriad && !hasExtensions) || (!hasTriad && hasExtensions)) {
					chordType = `${chordType}${ChordIntervalRelations[state.seventh]}`;
					hasSeventh = true;
				}
			}

			if (state.ninth) {
				if (hasSeventh) {
					altered.push(ChordIntervalRelations[state.ninth]);
				} else {
					chordType = `${chordType}${ChordIntervalRelations[state.ninth]}`;
				}
			} else if (state.eleventh) {
				if (hasSeventh) {
					altered.push(ChordIntervalRelations[state.eleventh]);
				} else {
					chordType = `${chordType}${ChordIntervalRelations[state.eleventh]}`;
				}
			} else if (state.thirteenth) {
				if (hasSeventh) {
					altered.push(ChordIntervalRelations[state.thirteenth]);
				} else {
					chordType = `${chordType}${ChordIntervalRelations[state.thirteenth]}`;
				}
			}

			if (!state.third) {
				altered.push('no3');
			}

			return chordType != '' ? `${chordType}${altered.length > 0 ? `(${altered.join(',')})` : ''}` : undefined;
		}

		return chordType;
	}

	get [Symbol.toStringTag](): string {
		return `Chord: ${this.pitches}`;
	}

	/**
	 *	Used for creating chords by name
	 *
	 * @private
	 */
	private discoverAccident() {
		const notes = this._notes;
		const rootNote = this.root;

		// This is to figure out if flats is a better match than sharps when the root note is natural
		const sharpNotes = R.length(R.filter((note) => note.isSharp, notes));
		const flatNotes = R.length(R.filter((note) => note.isFlat, notes));

		if (rootNote.isFlat || flatNotes > 0) {
			this._notesType = NoteType.Flat;
		}

		if (rootNote.isSharp || sharpNotes > 0) {
			this._notesType = NoteType.Sharp;
		}
	}

	/**
	 * Creates a chord based on a chordName f.ex: Am7
	 *
	 * @private
	 * @param {String} chordName
	 * @return {Array<Note>}
	 */
	private createChord(description: ChordSymbol | ChordIntervals) {
		// this._intervals will exist in `fromScale`
		if (isDefined(this._name)) {
			this._intervals = ChordDefinition[this._name].intervals;
		}

		if (isUndefined(this._intervals)) {
			return;
		}

		this.createNotes(interval.separate(this._intervals));

		if (isUndefined(this._notes) || !this._notes.length) {
			throw new PlayaError('Chord', `Could create chord with <${description}>`);
		}

		this.discoverAccident();

		this.assignOctaves();
	}
}

export const createFromScale = (
	scale: Scale,
	chordIntervalsArray: Interval[],
	nrOfNotes: number,
	structureIntervalsArray: string[]
): { chordIntervals: Interval[] } => {
	const chordIntervals: Interval[] = [];
	const notes = scale.notes;

	for (let index = 0; index < nrOfNotes; index++) {
		const dist = structureIntervalsArray[index];

		let interval = R.find(R.includes(dist), chordIntervalsArray);
		let noteIndex: number;

		if (isUndefined(interval) || chordIntervalsArray.indexOf(interval) === -1) {
			const newDist = `${parseInt(dist, 10) - 7}`;
			const newInterval = R.find(R.includes(newDist), chordIntervalsArray);

			if (isUndefined(newInterval)) {
				continue;
			}

			noteIndex = chordIntervalsArray.indexOf(newInterval);

			if (!notes[noteIndex]) {
				continue;
			}

			interval = (dist + newInterval.split('')[1]) as Interval;
		} else {
			noteIndex = chordIntervalsArray.indexOf(interval as Interval);
		}

		chordIntervals.push(interval);
	}

	return { chordIntervals };
};

export const createFromStructure = (
	structure: ChordStructure,
	scale: Scale,
	scaleIntervals: Interval[],
	nrOfNotes: number
): { chordIntervals: Interval[] } | undefined => {
	const compatibleChordNames = <ChordName[]>SimilarChordsByStructure.get(structure);
	let chordIntervals: Interval[] | undefined;
	let structureIntervalsArray: string[];

	for (let index = 0; index < compatibleChordNames.length; index++) {
		const name = compatibleChordNames[index];
		const chord = ChordDefinition[name];

		structureIntervalsArray = chord.intervals.split(' ').map((interval) => interval.replace(/\D/, ''));

		const fromScale = createFromScale(
			scale,
			scaleIntervals,
			nrOfNotes,
			// transform intervals to structure[]
			structureIntervalsArray
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
	structure: ChordStructure
): { symbol: ChordSymbol; chordIntervals: ChordIntervals; chordStructure: ChordStructure } | null => {
	const chordIntervalsArray = intervals.split(' ') as Interval[];
	const intervalsValidation = chordIntervalsArray.map((interval) => typeof Semitones[interval] !== 'undefined');

	if (intervalsValidation.includes(false)) {
		throw new PlayaError('Chord', `[${intervals}] has unrecognized intervals.`);
	}

	const defaultIntervals = Array.from(structure);
	let structureIntervals;

	if (structure === ChordStructure.Triad) {
		// less likely to give a P5 chord
		structureIntervals = roll(defaultIntervals, ['0.700', '1.000'], random.float);
	} else {
		structureIntervals = defaultIntervals.length === 1 ? defaultIntervals[0] : choose(Array.from(defaultIntervals));
	}

	const structureIntervalsArray = structureIntervals.split(' ');
	const nrOfNotes = structureIntervalsArray.length;

	const scale = new Scale(root as NoteSymbol, intervals as string);

	let { chordIntervals } = createFromScale(scale, chordIntervalsArray, nrOfNotes, structureIntervalsArray);

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
