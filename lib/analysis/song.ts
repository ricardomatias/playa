import * as R from 'ramda';

import { NoteEvent } from '../core/NoteEvent';
import { isDefined } from '../utils/types-guards';
import { filterHighestMatches, friendly, FriendlyRanking } from '../tools/friendly';
import { Note } from '../core/Note';
import { PlayaError } from '../utils/error';
import { natural } from '../utils/note';
import { NoteSymbol } from '../constants/note';



/**
* Analysis Type
* @typedef {Object} Analysis
* @memberof Types
*
* @property {number} start interval start time
* @property {number} end interval end time
* @property {Array<NoteSymbol>} notes notes
* @property {Array<NoteEvent>} events note events
* @property {Array<FriendlyRanking>} matches key matches
*/

export interface Analysis {
	start: number;
	end: number;
	notes: NoteSymbol[];
	events: NoteEvent[];
	matches: FriendlyRanking[];
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

	private stack: Analysis[] = [ this.memory ];

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

		this.noteEvents = [ ...(R.sortBy(R.prop('time'), noteEvents)) ];

		this.analyse(this.noteEvents);
	}
	/**
	 * Get all the matches
	 *
	 * @member matches
	 * @memberof Analysis#SongAnalysis#
	 * @type {FriendlyRanking[][]}
	 */
	get matches(): FriendlyRanking[][] {
		return this.stack.map(entry => entry.matches);
	}

	/**
	 * Get the analysis results
	 *
	 * @member analysis
	 * @type {Analysis[]}
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
			events: []
		}
	}

	private analyse(noteEvents: NoteEvent[]) {
		let noteEvent;
		let next = 0;

		while ((noteEvent = noteEvents.shift())) {
			const note = new Note(noteEvent.midi);
			const hasSharps = this.hasSharps;

			next = noteEvent.next;

			if ((this.memory.notes.includes(note.note) ||
				(note.enharmonic && this.memory.notes.includes(note.enharmonic)))) continue;

			this.memorise(noteEvent, note);

			if (this.memory.notes.length < 3) continue;

			const matches = filterHighestMatches(friendly(this.memory.notes));

			if (!matches.length) continue;

			const newScore = matches[0].match;

			// update score comparison when the accidental changes
			if (hasSharps !== this.hasSharps) {
				this.score = newScore;

				continue;
			}

			if (newScore < this.score) {
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

			const matches = filterHighestMatches(friendly(memory.notes));

			memory.matches = matches;
		});
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
		const notes = [ ...this.memory.notes ];

		// check memory with sharps
		const sharps = notes.map(n => {
			const note = new Note(n);

			return note.isNatural || note.isSharp ? note.note : note.enharmonic;
		}).filter(isDefined);

		// check memory with flats
		const flats = notes.map(n => {
			const note = new Note(n);

			return note.isNatural || note.isFlat ? note.note : note.enharmonic;
		}).filter(isDefined);

		const sharpsCount = R.uniq(sharps.map(natural)).length;
		const flatsCount = R.uniq(flats.map(natural)).length;

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
