import * as R from 'ramda';
import { Scale } from '../core/Scale';
import { Key } from '../core/Key';
import { Chord } from '../core/Chord';
import { Note } from '../core/Note';
import distance from '../tools/distance';
import { mapNotesToString, mapNotesToMidi, mapNotesToFreq } from '../utils';
import { isDefined } from '../utils/types-guards';
import { Interval } from '../constants';

interface SequenceChords {
	array: Chord[];
	midi: number[][];
	freq: number[][];
	string: string[];
}

/**
 * Defines a sequence of notes/chords
 *
 * @class
 * @memberof Composition#
 *
 * @name Sequence
 */
export class Sequence {
	private _scale: Scale;
	private _chords: Chord[] = [];
	private _notes: Note[] = [];
	private _intervals: string[];

	/**
	 * In order to create a chords sequence a {@link Key} class must be used.
	 *
	 * @constructs Sequence
	 * @memberof Composition#
	 * @example
	 *const Amajor = new Key('A', Scale.Major);
	 *const seq = new Sequence(Amajor).I.II.V;
	 *seq.string => [ 'A3', 'B3', 'E4' ];
	 *seq.chords.string => [ 'AM7', 'Bm7', 'E7' ]
	 *seq.chords.midi => [ [ 69, 73, 76, 80 ], [ 71, 74, 78, 81 ], [ 64, 68, 71, 74 ] ]
	 *
	 * @param {Scale | Key} scale
	 */
	constructor(scale: Scale) {
		this._scale = scale;
		this._intervals = scale.intervals.split(' ');
	}

	/**
	 * Gets the sequence notes as string
	 * @member string
	 * @example
	 * const Amajor = new Scale('A', Scale.Major);
	 * new Sequence(Amajor).I.II.V.string => [ 'A3', 'B3', 'E4' ];
	 *
	 * @readonly
	 * @type {string[]}
	 * @memberof Composition#Sequence#
	 */
	get string(): string[] {
		if (!this._notes.length) {
			return [];
		}

		const notes = R.sort((a, b) => {
			if (a.midi && b.midi) {
				return a.midi - b.midi;
			}

			return 0;
		}, this._notes);

		return mapNotesToString(notes);
	}

	/**
	 * Gets the sequence notes as midi
	 * @member midi
	 * @example
	 * const Amajor = new Scale('A', Scale.Major);
	 * new Sequence(Amajor).I.II.V.midi => [ 69, 71, 76 ];
	 *
	 * @readonly
	 * @type {number[]}
	 * @memberof Composition#Sequence#
	 */
	get midi(): number[] {
		if (!this._notes.length) {
			return [];
		}

		return mapNotesToMidi(this._notes);
	}

	/**
	 * Gets the sequence notes as frequencies
	 * @member freq
	 * @example
	 * const Amajor = new Scale('A', Scale.Major);
	 * new Sequence(Amajor).I.II.V.freq => [ 440, 493.8833012561241, 659.2551138257398 ]
	 *
	 * @readonly
	 * @type {number[]}
	 * @memberof Composition#Sequence#
	 */
	get freq(): number[] {
		if (!this._notes.length) {
			return [];
		}

		return mapNotesToFreq(this._notes);
	}

	/**
	 * Gets the sequence chords
	 * @member chords
	 * @example
	 *	const Amajor = new Key('A', Scale.Major);
	 *const seq = new Sequence(Amajor).I.II.V;
	 *seq.chords.string => [ 'AM7', 'Bm7', 'E7' ]
	 *seq.chords.midi => [ [ 69, 73, 76, 80 ], [ 71, 74, 78, 81 ], [ 64, 68, 71, 74 ] ]
	 *
	 * @readonly
	 * @type {Object}
	 * @property {Chord[]} array
	 * @property {number[]} midi
	 * @property {string[]} string
	 * @property {number[]} freq
	 * @memberof Composition#Sequence#
	 */
	get chords(): SequenceChords {
		const chords = this._chords;

		return {
			array: chords,
			midi: chords.map((chord) => chord.midi),
			string: chords.map((chord) => chord.name).filter(isDefined),
			freq: chords.map((chord) => chord.freq),
		};
	}

	private getAtPosition(reg: RegExp, romanPos: string): Sequence {
		const scale = this._scale;
		const root = scale.root;
		const interval = this._intervals.find((interval) => reg.test(interval));

		if (!interval) return this;

		const notes: Note[] = scale.notes.filter((note) => note.note === distance.transposeUp(root, interval as Interval));

		this._notes = this._notes.concat(notes);

		if (scale instanceof Key) {
			let chord: Chord | undefined;

			switch (romanPos) {
				case 'I':
					chord = scale.I?.chord;
					break;
				case 'II':
					chord = scale.II?.chord;
					break;
				case 'III':
					chord = scale.III?.chord;
					break;
				case 'IV':
					chord = scale.IV?.chord;
					break;
				case 'V':
					chord = scale.V?.chord;
					break;
				case 'VI':
					chord = scale.VI?.chord;
					break;
				case 'VII':
					chord = scale.VII?.chord;
					break;
			}

			if (chord) this._chords.push(chord);
		}

		return this;
	}

	get I(): Sequence {
		return this.getAtPosition(/1/, 'I');
	}
	get II(): Sequence {
		return this.getAtPosition(/2/, 'II');
	}
	get III(): Sequence {
		return this.getAtPosition(/3/, 'III');
	}
	get IV(): Sequence {
		return this.getAtPosition(/4/, 'IV');
	}
	get V(): Sequence {
		return this.getAtPosition(/5/, 'V');
	}
	get VI(): Sequence {
		return this.getAtPosition(/6/, 'VI');
	}
	get VII(): Sequence {
		return this.getAtPosition(/7/, 'VII');
	}

	get [Symbol.toStringTag](): string {
		return `Sequence: ${this.string}`;
	}
}
