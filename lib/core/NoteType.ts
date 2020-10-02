/**
 * @typedef {Object} NoteType
 *
 * @property {Note} Note "note"
 * @property {string} Midi "midi"
 * @property {string} Frequency "freq"
 * @property {string} String "string"
 *
 * @enum NoteType
 */
export enum NoteType {
/** @type {NoteType.Note} */
	Note = 'note',
/** @type {NoteType.Midi} */
	Midi = 'midi',
/** @type {NoteType.Frequency} */
	Frequency = 'freq',
/** @type {NoteType.String} */
	String = 'string',
}


