/**
 * Types
 * @namespace {module} Types
 */

/**
* Event Type
* @typedef {Object} Event
* @memberof Types
*
* @property {Number} time transport time in ticks
* @property {number} dur duration in ticks
* @property {number} next the next event's time - this allows having note overlap
* @property {Boolean} isRest is it a rest?
* @example
* {
*   dur: 480,
*   next: 480,
*   time: 0,
*   isRest: false,
* ]
*/

/**
 * Rhythm type
 * @memberof Types
 * @typedef RhythmType
 * @enum
 * @param {string} Free "Free"
 * @param {string} Turn "Turn"
 */


/**
 * Movement rhythm
 * @memberof Types
 * @typedef MovementRhythm
 * @enum
 * @param {string} Euclidean "Euclidean"
 * @param {string} Turn "Turn"
 */

/**
 * Movement Type
 * @typedef {Object} Movement
 * @memberof Types
 *
 * @property {Array<ModulationEvent>} timeline combination of hits and rests
 * @property {Array<Object>} events the kind of turn event
 * @example
 *{
 *	timeline: [
 *		{ time: 0, dur: 1440, key: { root: 'C#', scale: '1P 2m 3m 4P 5P 6m 7m' } },
 *        { time: 1440, dur: 1440, key: { root: 'D', scale: '1P 2M 3M 4A 5P 6M 7M' } },
 *        { time: 2880, dur: 960, key: { root: 'F#', scale: '1P 2M 3m 4P 5P 6m 7m' } },
 *        { time: 3840, dur: 1440, key: { root: 'A', scale: '1P 2M 3M 4P 5P 6M 7M' } },
 *        {  time: 5280, dur: 1440, key: { root: 'C#', scale: '1P 2m 3m 4P 5P 6m 7m' } },
 *        {  time: 6720, dur: 960, key: { root: 'F#', scale: '1P 2m 3m 4P 5P 6m 7m' } }
 *	],
 *	events: [
 * 		{
 *          key: 'A',
 *          root: 'C#',
 *          type: 'mode',
 *          scaleName: 'Phrygian',
 *          position: 'III'
 *        },
 *        {
 *          key: 'A',
 *          root: 'D',
 *          type: 'mode',
 *          scaleName: 'Lydian',
 *          position: 'IV'
 *        },
 *        {
 *          key: 'A',
 *          root: 'F#',
 *          type: 'mode',
 *          scaleName: 'Aeolian',
 *          position: 'VI'
 *        },
 *        {
 *          key: 'A',
 *          root: 'A',
 *          type: 'mode',
 *          scaleName: 'Ionian',
 *          position: 'I'
 *        },
 *        {
 *          key: 'A',
 *          root: 'C#',
 *          type: 'mode',
 *          scaleName: 'Phrygian',
 *          position: 'III'
 *        },
 *        {
 *          key: 'F#',
 *          root: 'F#',
 *          position: 'I',
 *          interval: '5P',
 *          type: 'key',
 *          scaleName: 'Phrygian'
 *        }
 *	]
 *}
 */
