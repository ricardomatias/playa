import * as R from 'ramda';
import { Scale, Key, Chord } from '../core';
import distance from './distance';
import { mapNotes } from '../utils';
import { NoteType } from '../core/note-type';


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
	private _notes = []
	private _canCreateChords = false;
	private _intervals: string[];

	/**
	* Creates an instance of Sequence.
	* @constructs Sequence
	* @memberof Tools#
	*
	* @param {Scale | Key} scale
	*/
	constructor(scale: Scale) {
		if (scale instanceof Key) {
			this._canCreateChords = true;
		}

		this._scale = scale;
		this._scale = scale;
		this._intervals = scale.type.split(' ');
	}

	get string() {
		if (!this._notes.length) {
			return [];
		}

		const notes = R.sortBy(R.prop('midi'), this._notes);

		return mapNotes(notes, NoteType.STR);
	}

	get midi() {
		if (!this._notes.length) {
			return [];
		}

		return mapNotes(this._notes, NoteType.MIDI);
	}

	get freq() {
		if (!this._notes.length) {
			return [];
		}

		return mapNotes(this._notes, NoteType.FREQ);
	}

	get chords() {
		const chords = this._chords;

		return {
			array: chords,
			midi: chords.map((chord) => chord.midi),
			string: chords.map((chord) => chord.name),
			freq: chords.map((chord) => chord.freq),
		};
	}

	private getAtPosition(reg: RegExp, romanPos: string) {
		const scale = this._scale;
		const root = scale.root;
		const interval = this._intervals.find((interval) => (reg.test(interval)));

		if (!interval) return this;

		const notes = scale.notes.filter((note) => (note.note === distance.transposeUp(root, interval)));

		this._notes = this._notes.concat(notes);

		if (this._canCreateChords) {
			const chord = scale[romanPos].chord;

			this._chords.push(chord);
		}

		return this;
	}

	get I() {
		return this.getAtPosition(/1/, 'I');
	}
	get II() {
		return this.getAtPosition(/2/, 'II');
	}
	get III() {
		return this.getAtPosition(/3/, 'III');
	}
	get IV() {
		return this.getAtPosition(/4/, 'IV');
	}
	get V() {
		return this.getAtPosition(/5/, 'V');
	}
	get VI() {
		return this.getAtPosition(/6/, 'VI');
	}
	get VII() {
		return this.getAtPosition(/7/, 'VII');
	}
}

export default Sequence;
