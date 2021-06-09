// *****************************************************************************
// NOTE
// *****************************************************************************

/**
 * Note symbols
 * @typedef NoteSymbol
 * @memberof Types
 * @property {string} C "C"
 * @property {string} Db "Db"
 * @property {string} C# "C#"
 * @property {string} D "D"
 * @property {string} Eb "Eb"
 * @property {string} D# "D#"
 * @property {string} E "E"
 * @property {string} F "F"
 * @property {string} Gb "Gb"
 * @property {string} F# "F#"
 * @property {string} G "G"
 * @property {string} Ab "Ab"
 * @property {string} G# "G#"
 * @property {string} A "A"
 * @property {string} Bb "Bb"
 * @property {string} A# "A#"
 * @property {string} B "B"
 */

/**
 * Notes with sharps
 * @type {Array<String>}
 * @memberof Constants
 * @default
 * @readonly
 */
export const Sharps = <const>[ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];

export type Sharp = typeof Sharps[number]

/**
 * Notes with flats
 * @type {Array<String>}
 * @memberof Constants
 * @default
 * @readonly
 */
export const Flats = <const>[ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ];

export type Flat = typeof Flats[number]

/**
 * Enharmonic pairs
 * @type {Array<String>}
 * @memberof Constants
 * @default
 * @readonly
 */
export const Enharmonics = <const>[ 'C#|Db', 'D#|Eb', 'F#|Gb', 'G#|Ab', 'A#|Bb' ];

export type Enharmonic = typeof Enharmonics[number]

/**
 * Diatonic notes
 * @type {Array<String>}
 * @memberof Constants
 * @default
 * @readonly
 */
export const DiatonicNotes = <const>[ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ];

export type DiatonicNote = typeof DiatonicNotes[number]


export type NoteSymbol = Sharp | Flat;
