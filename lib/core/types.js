/**
 * Namepsace for all Types
 * @namespace Types
 */

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

/** @type {NoteType.NOTE} */
NoteType.NOTE = 'note';

/** @type {NoteType.MIDI} */
NoteType.MIDI = 'midi';

/** @type {NoteType.FREQ} */
NoteType.FREQ = 'freq';

/** @type {NoteType.STR} */
NoteType.STR = 'str';

export default NoteType;
