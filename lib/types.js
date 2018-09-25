/**
 * @typedef {Object} NoteType
 * @property {string} MIDI "midi"
 * @property {string} FREQ "freq"
 * @property {string} STR "str"
 *
 * @class NoteType
 */
class NoteType {}

/** @type {NoteType} midi */
NoteType.MIDI = 'midi';

/** @type {NoteType} freq */
NoteType.FREQ = 'freq';

/** @type {NoteType} str */
NoteType.STR = 'str';

export default NoteType;
