// *****************************************************************************
// NOTE
// *****************************************************************************
/**
 * Notes
 * @namespace Note
 * @memberof Constants
 */

/**
 * Notes with sharps
 * @enum {Array<String>}
 * @memberof Constants.Note
 * @default
 * @readonly
 */
const SHARPS = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];

/**
 * Notes with flats
 * @enum {Array<String>}
 * @memberof Constants.Note
 * @default
 * @readonly
 */
const FLATS = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ];

/**
 * Enharmonic pairs
 * @enum {Array<String>}
 * @memberof Constants.Note
 * @default
 * @readonly
 */
const ENHARMONICS = [ 'C#|Db', 'D#|Eb', 'F#|Gb', 'G#|Ab', 'A#|Bb' ];

/**
 * Diatonic notes
 * @enum {Array<String>}
 * @memberof Constants.Note
 * @default
 * @readonly
 */
const DIATONIC_NOTES = [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ];

export { SHARPS, FLATS, ENHARMONICS, DIATONIC_NOTES };
