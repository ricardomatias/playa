/**
 * @typedef {Object} NoteType
 * @property {Note} NOTE "note"
 * @property {string} MIDI "midi"
 * @property {string} FREQ "freq"
 * @property {string} STR "str"
 *
 * @class NoteType
 */
class NoteType {}

/** @type {NoteType} note */
NoteType.NOTE = 'note';

/** @type {NoteType} midi */
NoteType.MIDI = 'midi';

/** @type {NoteType} freq */
NoteType.FREQ = 'freq';

/** @type {NoteType} str */
NoteType.STR = 'str';

export default NoteType;
