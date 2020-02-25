/**
 * @typedef {Object} NoteType
 *
 * @property {Note} NOTE "note"
 * @property {string} MIDI "midi"
 * @property {string} FREQ "freq"
 * @property {string} STR "str"
 *
 * @class NoteType
 */
export class NoteType {}

/** @type {NoteType.NOTE} */
NoteType.NOTE = 'note';

/** @type {NoteType.MIDI} */
NoteType.MIDI = 'midi';

/** @type {NoteType.FREQ} */
NoteType.FREQ = 'freq';

/** @type {NoteType.STR} */
NoteType.STR = 'string';

