import * as R from 'ramda';
import { Scale, Key, Chord, Note } from '../core';
import distance from './distance';
import { mapNotes } from '../utils';
import { NoteType } from '../core/note-type';


interface SequenceChords {
	array: Chord[];
	midi: number[][];
	freq: number[][];
	string: string[];
}

/**
 * Defines a sequence of notes/chords
 * @class
 * @memberof Tools#
 *
 * @name Sequence
 */
class Sequence {
	private _scale: Scale;
	private _chords: Chord[] = []
	private _notes: Note[] = []
	private _intervals: string[];

	/**
	* Creates an instance of Sequence.
	* @constructs Sequence
	* @memberof Tools#
	*
	* @param {Scale | Key} scale
	*/
	constructor(scale: Scale) {
		this._scale = scale;
		this._intervals = scale.type.split(' ');
	}

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

		return mapNotes(notes, NoteType.STR) as string[];
	}

	get midi(): number[] {
		if (!this._notes.length) {
			return [];
		}

		return mapNotes(this._notes, NoteType.MIDI) as number[];
	}

	get freq(): number[] {
		if (!this._notes.length) {
			return [];
		}

		return mapNotes(this._notes, NoteType.FREQ) as number[];
	}

	get chords(): SequenceChords {
		const chords = this._chords;

		return {
			array: chords,
			midi: chords.map((chord) => chord.midi),
			string: chords.map((chord) => chord.name),
			freq: chords.map((chord) => chord.freq),
		};
	}

	private getAtPosition(reg: RegExp, romanPos: string): Sequence {
		const scale = this._scale;
		const root = scale.root;
		const interval = this._intervals.find((interval) => (reg.test(interval)));

		if (!interval) return this;

		const notes: Note[] = scale.notes.filter((note) => (note.note === distance.transposeUp(root, interval)));

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
}

export default Sequence;
