import * as R from 'ramda';

import { NoteEvent } from '../core/NoteEvent';
import { isDefined } from '../utils/types-guards';
import { filterHighestMatches, findMatchingKeys, MatchRanking } from './matches';
import { Note } from '../core/Note';
import { PlayaError } from '../utils/error';
import { NoteSymbol } from '../constants/note';
import { Key } from '../core';

export interface Analysis {
	start: number;
	end: number;
	notes: NoteSymbol[];
	events: NoteEvent[];
	matches: MatchRanking[];
}

/**
 * Tries to identify which possible scales are being used
 *
 * @class
 * @memberof Analysis#
 *
 * @name SongAnalysis
 */
export class SongAnalysis {
	private memory: Analysis = this.createMemory();

	private stack: Analysis[] = [this.memory];

	private score = 0;
	private hasSharps: boolean | undefined = undefined;

	private noteEvents: NoteEvent[];

	/**
	 * Creates an instance of SongAnalysis
	 * @constructs SongAnalysis
	 * @memberof Analysis#
	 *
	 * @param {Array<NoteEvent>} noteEvents
	 */
	constructor(noteEvents: NoteEvent[]) {
		if (R.isEmpty(noteEvents)) throw new PlayaError('SongAnalysis', 'Cannot analyse without any events');

		this.noteEvents = [...R.sortBy(R.prop('time'), noteEvents)];

		this.analyse(this.noteEvents);
	}
	/**
	 * Get all the matches
	 *
	 * @member matches
	 * @memberof Analysis#SongAnalysis#
	 * @type {MatchRanking[][]}
	 */
	get matches(): MatchRanking[][] {
		return R.map(
			R.sortBy((a: MatchRanking) => {
				return Key.isMode(a.scale) ? new Key(a.root as any, a.scale as any).modePosition : 0;
			}),
			this.stack.map((entry) => entry.matches)
		);
	}

	/**
	 * Get the analysis results
	 *
	 * @member analysis
	 * @type {IAnalysis[]}
	 * @memberof Analysis#SongAnalysis#
	 */
	get analysis(): Analysis[] {
		return this.stack;
	}

	private createMemory(): Analysis {
		return {
			notes: [],
			start: 0,
			end: 0,
			matches: [],
			events: [],
		};
	}

	private analyse(noteEvents: NoteEvent[]) {
		let noteEvent;
		let next = 0;

		while ((noteEvent = noteEvents.shift())) {
			const note = new Note(noteEvent.midi);
			const hasSharps = this.hasSharps;

			next = noteEvent.next;

			if (this.isInMemory(note)) continue;

			this.memorise(noteEvent, note);

			if (this.memory.notes.length < 3) continue;

			const matches = filterHighestMatches(findMatchingKeys(this.memory.notes));

			if (!matches.length) continue;

			const newScore = matches[0].match;

			// update score comparison when the accidental changes
			if (hasSharps !== this.hasSharps) {
				this.score = newScore;

				continue;
			}

			// let foo =  || (typeof hasSharps === 'boolean' && note.isSharp && !hasSharps)
			if (newScore < this.score || this.hasDifferentAccidental(note)) {
				// set previous memory time
				this.memory.end = noteEvent.time;
				this.memory.notes.pop();
				this.memory.events.pop();

				this.validateAccidental();

				this.memory = this.createMemory();

				this.memorise(noteEvent, note);
				this.memory.start = noteEvent.time;

				this.hasSharps = undefined;

				this.stack.push(this.memory);
				this.score = 0;
			} else {
				this.score = newScore;
			}
		}

		this.memory.end = next;

		this.stack.forEach((memory, index) => {
			// TODO v2 remove this
			if (memory.notes.length === 1) {
				memory.notes = memory.notes.concat(R.tail(this.stack[index - 1].notes));
				memory.events = memory.events.concat(R.tail(this.stack[index - 1].events));

				memory.start = R.sortBy(R.prop('time'), memory.events)[0].time;
			}

			const matches = filterHighestMatches(findMatchingKeys(memory.notes));

			memory.matches = matches;
		});
	}

	private hasDifferentAccidental(note: Note) {
		if (!note.isNatural && typeof this.hasSharps === 'boolean') {
			const n = this.hasSharps !== note.isSharp ? note.enharmonic : note.note;
			return this.memory.notes.includes(Note.stripAccidental(n as NoteSymbol) as NoteSymbol);
		}

		return false;
	}

	private isInMemory(note: Note): boolean {
		const hasNote = this.memory.notes.includes(note.note);
		const hasNoteEnh = !!(note.enharmonic && this.memory.notes.includes(note.enharmonic));

		if (hasNote || hasNoteEnh) return true;

		return false;
	}

	private memorise(noteEvent: NoteEvent, note: Note) {
		this.memory.notes.push(note.note);
		this.memory.events.push(noteEvent);

		// natural notes can go directly in
		if (this.memory.notes.length < 3) {
			return;
		}

		this.validateAccidental();
	}

	private validateAccidental() {
		const notes = [...this.memory.notes];

		// check memory with sharps
		const sharps = notes
			.map((n) => {
				const note = new Note(n);

				return note.isNatural || note.isSharp ? note.note : note.enharmonic;
			})
			.filter(isDefined);

		// check memory with flats
		const flats = notes
			.map((n) => {
				const note = new Note(n);

				return note.isNatural || note.isFlat ? note.note : note.enharmonic;
			})
			.filter(isDefined);

		const sharpsCount = R.uniq(sharps.map(Note.stripAccidental)).length;
		const flatsCount = R.uniq(flats.map(Note.stripAccidental)).length;

		if (sharpsCount > flatsCount) {
			this.memory.notes = sharps;
			this.hasSharps = true;
		}

		if (flatsCount > sharpsCount) {
			this.memory.notes = flats;
			this.hasSharps = false;
		}
	}
}
