import * as R from 'ramda';
import HarmonyBase from './HarmonyBase';
import Note from './Note';
import Scale from './Scale';
import { CHORDS, CHORD_INTERVALS, CHORD_TYPES, CHORD_STRUCTURES } from '../constants';
import { deconstructName } from '../utils/chord';
import { whilst, natural } from '../utils';
import { distance, shuffle, rotate, choose, Random } from '../tools';

/**
 * Defines a Chord
 * @class
 * @memberof Core#
 *
 * @name Chord
 * @extends HarmonyBase
 */
class Chord extends HarmonyBase {
	/**
	 * Creates an instance of Chord.
	 * @constructs Chord
	 * @memberof Core#
	 *
	 * @param {String | Object} chord - a chord name f.ex: 'Am7'
	 * @param {Object} [chord.root] - f.ex: A
	 * @param {Object} [chord.scale] - f.ex: Scale.DORIAN
	 * @param {Object} [chord.structure] - f.ex: Chord.SIXTH
	 * @param {Array<Number>} [octaves = [ 3, 1]] [starting, number of octaves] range of octaves to map notes to
	 *
	 * @example
	 * new Chord('Am6');
	 * new Chord({ root: 'A', type: Scale.DORIAN, structure: Chord.SIXTH  });
	 */
	constructor(chord, octaves = [ 3, 1 ]) {
		const chordName = chord;
		const isChordName = R.is(String, chord);

		const {
			root,
			type,
			structure,
		} = isChordName ? deconstructName(chordName) : chord;

		// !THIS NEEDS TO BE CALLED HERE
		super(root, type, octaves, 'chord');

		this._type = type;
		this._chordName = chordName;

		if (this._root && this._type) {
			if (R.is(String, chord)) {
				this._notes = this._createChord();

				this._discoverAccident();
			} else {
				this._notes = this._createChordByStructure(structure);
				this._structure = structure;
			}
		}

		if (!this._notes) {
			return;
		}

		this.assignOctaves();
	}

	/**
	* Returns the chord's name
	* @member name
	* @memberof Core#Chord#
	* @type {string}
	*/
	get name() {
		return this._chordName;
	}

	/**
	* Returns the chord's structure
	* @example
	* 'G7' => [ 4, '1 3 5 7' ]
	* @member structure
	* @memberof Core#Chord#
	* @type {Array<number, string>}
	*/
	get structure() {
		if (this._structure) {
			return this._structure;
		}

		for (const [ structure, chordTypes ] of CHORD_TYPES.entries()) {
			if (chordTypes.includes(this._type)) {
				this._structure = structure;
				break;
			}
		}

		return this._structure;
	}

	/**
	 * Inverts the chord's structure
	 * @function invert
	 * @memberof Core#Chord#
	 * @param {number} nrOfTimes
	 *
	 * @example
	 * 'Am' invert(1) => [ 'C3', 'E3', 'A3' ]
	 * 'Am' invert(2) => [ 'E3', 'A3', 'C4' ]
	 */
	invert(nrOfTimes) {
		this._notes = rotate(this._notes, nrOfTimes || Random.int(R.length(this._notes)));

		this.assignOctaves();
	}

	/**
	 *	Used for creating chords by name
	 *
	 * @private
	 */
	_discoverAccident() {
		const notes = this._notes;
		const rootNote = new Note(this._root);

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
	_createChord() {
		const root = this._root;
		const type = this._type;

		const chord = CHORD_INTERVALS.get(type)[0];
		const intervals = chord.split(' ');

		const notes = [ new Note(root) ];

		for (let idx = 1; idx < intervals.length; idx++) {
			const interval = intervals[idx];

			const note = distance.transposeUp(root, interval);

			notes.push(new Note(note));
		}


		return notes;
	}

	/**
	 * Creates a chord based on a chordName f.ex: Am7
	 *
	 * @private
	 *
	 * @param {String} structure
	 * @return {Array<Note>}
	 */
	_createChordByStructure(structure = Chord.TRIAD) {
		const root = this._root;
		const scaleIntervals = this._type.split(' ');
		let [ nrOfNotes, defaultIntervals ] = structure;

		defaultIntervals = Array.isArray(defaultIntervals) ? choose(defaultIntervals) : defaultIntervals;

		const intervals = defaultIntervals.split(' ');

		const scale = new Scale(root, this._type);

		this._hasFlats = scale.hasFlats;
		this._hasSharps = scale.hasSharps;

		let { chordNotes, chordIntervals } = this._createFromScale(scale, scaleIntervals, nrOfNotes, intervals);

		// if the provided scale doesn't have the default intervals from the given structure
		// try other chord types from the same type of structure
		if (chordIntervals.length !== nrOfNotes) {
			const fromDiffChords = this._createFromDiffChords(structure, scale, scaleIntervals, nrOfNotes);

			chordNotes = fromDiffChords.chordNotes;
			chordIntervals = fromDiffChords.chordIntervals;
		}

		if (!chordIntervals) {
			return [];
		}

		const chord = chordIntervals.join(' ');

		this._type = Chord.findChordName(chord);

		this._chordName = `${root}${this._type}`;

		return chordNotes;
	}

	_createFromScale(scale, scaleIntervals, nrOfNotes, intervals) {
		const chordNotes = [];
		const chordIntervals = [];
		const notes = scale.notes;

		for (let index = 0; index < nrOfNotes; index++) {
			const dist = intervals[index];
			let interval = R.find(R.includes(dist), scaleIntervals);
			let noteIndex = scaleIntervals.indexOf(interval);
			let note = notes[noteIndex];

			if (!note) {
				interval = R.find(R.includes(dist - 7), scaleIntervals);
				noteIndex = scaleIntervals.indexOf(interval);

				if (!notes[noteIndex]) {
					continue;
				}

				note = notes[noteIndex];
				interval = dist + interval.split('')[1];
			}

			chordNotes.push(note);
			chordIntervals.push(interval);
		}

		return { chordNotes, chordIntervals };
	}

	_createFromDiffChords(structure, scale, scaleIntervals, nrOfNotes) {
		const types = shuffle(CHORD_TYPES.get(structure));
		let chordIntervals;
		let chordNotes;

		for (let index = 0; index < types.length; index++) {
			const chordType = types[index];
			const chord = CHORD_INTERVALS.get(chordType)[0];

			const fromScale = this._createFromScale(scale, scaleIntervals, nrOfNotes, chord.split(' '));

			chordIntervals = fromScale.chordIntervals;
			chordNotes = fromScale.chordNotes;

			if (chordIntervals.length === nrOfNotes) {
				break;
			} else {
				chordIntervals = null;
				chordNotes = null;
			}
		}

		return { chordNotes, chordIntervals };
	}

	/**
	 * Finds the most suitable chord name for this chord
	 * @function findChordName
	 * @memberof Core#Chord
	 * @static
	 *
	 * @example findChordName('1P 3M 5P') => 'maj'
	 * @param {String} chord
	 * @return {String} chord
	 */
	static findChordName(chord) {
		let chordType;

		for (const [ name, type ] of CHORD_INTERVALS.entries()) {
			if (chordType) { // this is so we don't get the empty major
				break;
			}

			if (R.head(type) === chord) {
				chordType = name;
			}
		}

		if (!chordType) {
			let intervals = chord.split(' ');
			const last = R.last(intervals);

			try {
				whilst(() => {
					intervals = R.take(intervals.length - 1, intervals);
					const tempChord = intervals.join(' ');

					for (const [ name, type ] of CHORD_INTERVALS.entries()) {
						if (R.head(type) === tempChord) {
							chordType = name;
						}
					}
				}, () => (!chordType));

				chordType = `${chordType}add${last.replace(/\D/g, '')}`;
			} catch (error) {
				return '';
			}
		}

		return chordType;
	}
}

Chord.CHORDS = CHORDS;

/**
 * Chords
 * @memberof Core#Chord
 * @static
 * @type {String}
 * @example Chord.MAJOR_SIX_ADD_NINE = '6add9';
 */
for (const [ name, chord ] of CHORDS.entries()) {
	Chord[name] = chord;
}

Chord.STRUCTURES = CHORD_STRUCTURES;

/**
 * Chord Structures
 * @memberof Core#Chord
 * @static
 * @type {Array}
 * @example Chord.TRIAD = [ 3, '1 3 5' ];
 */
for (const [ name, structure ] of CHORD_STRUCTURES.entries()) {
	Chord[name] = structure;
}
/**
 * @example Chord.TYPES.get(Chord.TRIAD) = MAJOR_CHORD, MINOR_CHORD, ...;
 */
Chord.TYPES = CHORD_TYPES;

export default Chord;
