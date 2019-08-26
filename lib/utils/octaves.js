import Note from '../core/Note';
import { FLATS, SHARPS } from '../constants';

//  * For middle C to be C3 - 2
//  * For middle C to be C4 - 1
const MIDI_OCTAVE_OFFSET = 2;

const calcScaleInterval = (firstOct, numOctaves, distC) => {
	const midi = ((firstOct) * 12) + distC;

	const midiLenMax = Math.min(((firstOct + numOctaves) * 12) + distC, 127);

	const midiLen = Math.max(midiLenMax, 12);

	return {
		midi,
		midiLen,
	};
};

/**
 * Assign octaves to the notes passed
 * @function assignOctaves
 * @memberof Utils
 *
 * @param {Array<Scale|Chord>} notes
 * @param {Array<Number>} octaves which octaves to map to
 * @param {'scale'|'chord'} type which type of the notes array is it
 * @example
 * 		assignOctaves(scale.notes, [ 3, 2 ])
 * 		assignOctaves(chord.notes, [ 4, 2 ], 'chord')
 *
 * @return {Array<Note>} Array of the Key notes mapped to octaves
 */
const assignOctaves = (notes, octaves = [ -2, 11 ], { type = 'scale', hasFlats = false } = {}) => {
	const firstNote = notes[0];
	const chromaticNotes = firstNote.isFlat || hasFlats ? FLATS : SHARPS;
	const map = [];

	const allMidiNotes = [];
	let chromaticIndex = 0;

	if (!notes.length) {
		return;
	}

	const [ firstOct, numOctaves = 1 ] = octaves;

	let { midi, midiLen } = calcScaleInterval(firstOct + MIDI_OCTAVE_OFFSET, numOctaves, firstNote.distC);

	if (type === 'chord') {
		midiLen += 24;

		midiLen = Math.min(midiLen, 127);
	}

	if (midi < 1) {
		allMidiNotes.push(new Note(0));
		midi = 1;
	}

	for (midi; midi <= midiLen; midi++) {
		chromaticIndex = midi % 12;

		const chromaticNote = chromaticNotes[chromaticIndex];

		allMidiNotes.push(new Note(chromaticNote, midi));
	}

	let notesIndex = 0;

	// This garantees that the notes are on the right octaves
	allMidiNotes.forEach((midiNote) => {
		const chromaticNote = midiNote.note;
		const midi = midiNote.m;
		const note = notes[notesIndex].note;

		if (chromaticNote === note) {
			const mappedNote = new Note(note, midi);

			map.push(mappedNote);

			notesIndex++;

			if (notesIndex > notes.length - 1) {
				notesIndex = 0;
			}
		}
	});

	const mapLen = notes.length * numOctaves;

	return map.slice(0, mapLen);
};

export default assignOctaves;
