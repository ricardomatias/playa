// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

/**
 * Types
 * @namespace {module} Types
 */

/**
 * Core
 * @namespace {module} Core
 */

/**
 * Constants
 * @namespace {module} Constants
 */

/**
 * Composition tools
 * @namespace {module} Composition
 */

/**
 * The Toolshed
 * @namespace {module} Tools
 */

/**
 * Analysis
 * @namespace {module} Analysis
 */

/**
 * Note Intervals
 * @memberof Types
 * @typedef {"1P" | "2m" | "2M" | "3m" | "3M" | "4P" | "4A" | "5d" | "5P" | "5A" | "6m" | "6M" | "7m" | "7M" | "8P" | "9m" | "9M" | "11P" | "11A" | "13m" | "13M"} Interval
 */

/**
 * Mode position in roman numerals
 * @typedef ModePosition
 * @memberof Types
 * @property {string} I "I"
 * @property {string} II "II"
 * @property {string} III "III"
 * @property {string} IV "IV"
 * @property {string} V "V"
 * @property {string} VI "VI"
 * @property {string} VII "VII"
 */

/**
 * Note like types
 * @typedef {Note | NoteSymbol | string | number} NoteLike
 * @memberof Types
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
 * Time formats
 * @memberof Types
 * @typedef {Time | string | number} TimeFormat
 * @example
 * '2n' // string
 * 480 // number
 * new Time('1:0:0') // Time
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
 * Analysis Type
 * @typedef {Object} IAnalysis
 * @memberof Types
 *
 * @property {number} start interval start time
 * @property {number} end interval end time
 * @property {Array<NoteSymbol>} notes notes
 * @property {Array<NoteEvent>} events note events
 * @property {Array<FriendlyRanking>} matches key matches
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
