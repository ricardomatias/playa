/**
 * Types
 * @namespace {module} Types
 */

/**
* Motif Type
*
* @typedef {Array<NoteEvent>} Motif
* @memberof Types
* @example
 * [
 *	{ time: 0, note: 'G#4', midi: 80, dur: 480 },
 *	{ time: 480, note: 'E4', midi: 76, dur: 240 },
 *	{ time: 720, note: 'E4', midi: 76, dur: 240 },
 *	{ time: 960, note: 'D4', midi: 74, dur: 480 },
 *	{ time: 1440, note: 'F#4', midi: 78, dur: 240 },
 *	{ time: 1680, note: 'D4', midi: 74, dur: 240 }
 * ]
*/

/**
* NoteEvent Type
* @typedef {Object} NoteEvent
* @memberof Types
* @property {number} dur duration in ticks
* @property {Number} midi midi note
* @property {String} note note as string
* @property {Number} time transport time in ticks
* @example
* {
*   "dur": 480,
*   "midi": 90,
*   "note": "F#5",
*   "time": 0,
* ]
*/

/**
 * Percussion Type
 * @typedef {Object} Percussion
 * @memberof Types
 *
 * @property {Array<String>} pattern combination of hits and rests
 * @property {String} subdivision in note value
 * @example
 * {
 *	pattern: [ 'x', '-', 'x', '-' ],
 *	subdivision: '4n',
 * }
 */
