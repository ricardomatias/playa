import * as R from 'ramda';
import Scale from '../core/Scale';
import createScale from './scale';
import createMotif, { calcDuration } from './motif';
import { transportToTicks, friendly, choose, distribute, expandDuration } from '../tools';
import { whilst } from '../utils';
import { TICKS, RHYTHMS_DISTRIBUTIONS } from '../constants';

const ONE_BAR = TICKS.get('1n');

/**
 * @typedef {Object} Movement
 * @property {String} time when it's playing in Ticks
 * @property {String} dur in note value
 * @property {String} note the note
 * @property {Number} midi midi value
 */

/**
 * Creates a Movement
 * @private
 * @ignore
 *
 * @param {Number} length in Transport time
 * @param {Array<Array<Number>>} timeSignatures [[4, 4], [3, 4]]
 * @param {Array<Note>} [notes]
 * @param {Function} [motifAlgo]
 * @return {Array<Object>}
 */
function movement(length, timeSignatures, notes, motifAlgo = distribute.equal) {
	let movements = [];
	const scales = [];
	const ticks = transportToTicks(length);
	notes = R.uniq(notes);

	let neighbours;

	const isMatch = R.curry((percentage, neighbour) => neighbour.match >= percentage);

	for (let index = 0; index < ticks / ONE_BAR; index++) {
		if (!neighbours) {
			neighbours = friendly(notes);
		} else {
			let motif = movements[index - 1].map((motif) => (motif.note.replace(/\d/, '')));

			neighbours = friendly(motif);
		}

		let neighbour;
		let matchingScore = 1;

		whilst(() => {
			const matching = R.filter(isMatch(matchingScore), neighbours);

			neighbour = choose(matching);

			matchingScore -= 0.15;
		}, () => (!neighbour));

		const scale = createScale(neighbour.note, neighbour.scale, [ 2, 3 ]);

		scales.push(Scale.NAMES[neighbour.scale]);

		movements.push(createMotif(scale.notes, '2.1.0', motifAlgo));
	}

	movements = R.concat(R.head(movements), R.tail(movements).map((movement, index) => {
		const prevMovement = movements[index];
		const prevDuration = calcDuration(prevMovement);

		movement[0].time = prevDuration;

		return expandDuration(movement);
	}));

	return {
		movements: R.flatten(movements),
		scales,
	};
}


export default movement;
