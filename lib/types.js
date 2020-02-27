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

/**
 * TurnEvent Type
 * @typedef {Object} TurnEvent
 * @memberof Types
 *
 * @property {number} quarter which quarter
 * @property {number} time when
 * @property {number} dur duration
 * @property {object} key key
 * @property {object} key.root key's root note
 * @property {object} key.scale key's scale
 * @example
 * {
 * 	quarter: 1,
 * 	time: 0,
 * 	dur: 1920,
 * 	key: { root: 'Bb', scale: '1P 2M 3M 4A 5P 6M 7M' }
 * }
 */

/**
 * ChordEvent Type
 * @typedef {Object} ChordEvent
 * @memberof Types
 *
 * @property {Array<number>} chord midi notes
 * @property {string} chordName which chord it is
 * @property {number} dur duration
 * @property {number} time when
 * @example
 *  {
 *		chord: [ 71, 74, 78 ],
 * 		chordName: 'Bm',
 *		dur: 960,
 *		time: 0,
 *	}
 */

/**
 * ChordProgression Type
 * @typedef {Array<ChordEvent>} ChordProgression
 * @memberof Types
 *
 * @example
 * [{
 *		chord: [ 71, 74, 78 ],
 * 		chordName: 'Bm',
 *		dur: 960,
 *		time: 0,
 *	},
 * 		chord: [ 71, 74, 78 ],
 *		chordName: 'Bm',
 *		dur: 480,
 *		time: 960,
 *	}]
 */

/**
 * Movement Type
 * @typedef {Object} Movement
 * @memberof Types
 *
 * @property {Array<TurnEvent>} timeline combination of hits and rests
 * @property {Array<Object>} events the kind of turn event
 * @example
 *{
 *	timeline: [
 *		{ quarter: 1, time: 0, dur: 1440, key: { root: 'C#', scale: '1P 2m 3m 4P 5P 6m 7m' } },
 *        { quarter: 4, time: 1440, dur: 1440, key: { root: 'D', scale: '1P 2M 3M 4A 5P 6M 7M' } },
 *        { quarter: 7, time: 2880, dur: 960, key: { root: 'F#', scale: '1P 2M 3m 4P 5P 6m 7m' } },
 *        { quarter: 9, time: 3840, dur: 1440, key: { root: 'A', scale: '1P 2M 3M 4P 5P 6M 7M' } },
 *        { quarter: 12, time: 5280, dur: 1440, key: { root: 'C#', scale: '1P 2m 3m 4P 5P 6m 7m' } },
 *        { quarter: 15, time: 6720, dur: 960, key: { root: 'F#', scale: '1P 2m 3m 4P 5P 6m 7m' } }
 *	],
 *	events: [
 * 		{
 *          key: 'A',
 *          root: 'C#',
 *          type: 'modulateMode',
 *          scaleName: 'PHRYGIAN',
 *          position: 'III'
 *        },
 *        {
 *          key: 'A',
 *          root: 'D',
 *          type: 'modulateMode',
 *          scaleName: 'LYDIAN',
 *          position: 'IV'
 *        },
 *        {
 *          key: 'A',
 *          root: 'F#',
 *          type: 'modulateMode',
 *          scaleName: 'AEOLIAN',
 *          position: 'VI'
 *        },
 *        {
 *          key: 'A',
 *          root: 'A',
 *          type: 'modulateMode',
 *          scaleName: 'IONIAN',
 *          position: 'I'
 *        },
 *        {
 *          key: 'A',
 *          root: 'C#',
 *          type: 'modulateMode',
 *          scaleName: 'PHRYGIAN',
 *          position: 'III'
 *        },
 *        {
 *          key: 'F#',
 *          root: 'F#',
 *          position: 'I',
 *          interval: '5P',
 *          type: 'modulate',
 *          scaleName: 'PHRYGIAN'
 *        }
 *	]
 *}
 */
