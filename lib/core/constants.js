// *****************************************************************************
// SCALES
// *****************************************************************************

// TODO: REMOVE DUPLICATED SCALES
const CHROMATIC = '1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M';
const LYDIAN = '1P 2M 3M 4A 5P 6M 7M';
const MAJOR = '1P 2M 3M 4P 5P 6M 7M';
const IONIAN = '1P 2M 3M 4P 5P 6M 7M';
const MIXOLYDIAN = '1P 2M 3M 4P 5P 6M 7m';
const MINOR = '1P 2M 3m 4P 5P 6m 7m';
const AEOLIAN = '1P 2M 3m 4P 5P 6m 7m';
const DORIAN = '1P 2M 3m 4P 5P 6M 7m';
const PHRYGIAN = '1P 2m 3M 4M 5M 6m 7M';
const LOCRIAN = '1P 2m 3m 4P 5d 6m 7m';
const MAJOR_PENTATONIC = '1P 2M 3M 5P 6M';
const MINOR_PENTATONIC = '1P 3m 4P 5P 7m';
const EGYPTIAN = '1P 2M 4P 5P 7m';
const MELODIC_MINOR = '1P 2M 3m 4P 5P 6M 7M';
const ALTERED = '1P 2m 3m 3M 5d 6m 7m';
const HARMONIC_MINOR = '1P 2M 3m 4P 5P 6m 7M';

export const SCALES = {
	CHROMATIC,
	LYDIAN,
	MAJOR,
	IONIAN,
	MIXOLYDIAN,
	MINOR,
	AEOLIAN,
	DORIAN,
	PHRYGIAN,
	LOCRIAN,
	MAJOR_PENTATONIC,
	MINOR_PENTATONIC,
	EGYPTIAN,
	MELODIC_MINOR,
	ALTERED,
	HARMONIC_MINOR,
};

// *****************************************************************************
// CHORDS
// *****************************************************************************

export const CHORDS = new Map([
	[ '', [ '1P 3M 5P' ] ],
	[ 'maj', [ '1P 3M 5P' ] ],

	[ 'm', [ '1P 3m 5P' ] ],

	[ 'aug', [ '1P 3M 5A' ] ],
	[ 'dim', [ '1P 3m 5d' ] ],

	[ 'sus2', [ '1P 2M 5P' ] ],
	[ 'sus4', [ '1P 4P 5P' ] ],

	[ '5', [ '1P 5P' ] ],

	[ '7', [ '1P 3M 5P 7m', [ 'maj', '7m' ] ] ],
	[ 'm7', [ '1P 3m 5P 7m', [ 'm', '7m' ] ] ],
	[ 'm7b5', [ '1P 3m 5d 7m', [ 'dim', '7m' ] ] ],
	[ 'M7', [ '1P 3M 5P 7M', [ 'maj', '7M' ] ] ],

	[ '6', [ '1P 3M 5P 6M', [ 'maj', '6M' ] ] ],
	[ 'm6', [ '1P 3m 5P 6M', [ 'min', '6M' ] ] ],
	[ '6add9', [ '1P 3M 5P 6M 9M', [ 'maj', '6M 9M' ] ] ],

	[ '9', [ '1P 3M 5P 7m 9M', [ '7', '9M' ] ] ],
	[ 'm9', [ '1P 3m 5P 7m 9M', [ 'm7', '9M' ] ] ],
	[ 'M9', [ '1P 3M 5P 7M 9M', [ 'M7', '9M' ] ] ],

	[ '11', [ '1P 3M 5P 7m 9M 11P', [ '9', '11P' ] ] ],
	[ 'm11', [ '1P 3m 5P 7m 9M 11P', [ 'm9', '11P' ] ] ],
	[ 'M11', [ '1P 3M 5P 7M 9M 11P', [ 'M9', '11P' ] ] ],

	[ '13', [ '1P 3M 5P 7m 9M 13M', [ '11', '13M' ] ] ],
	[ 'm13', [ '1P 3m 5P 7m 9M 13M', [ 'm11', '13M' ] ] ],
	[ 'M13', [ '1P 3M 5P 7M 9M 13M', [ 'M11', '13M' ] ] ],
]);

// *****************************************************************************
// INTERVALS
// *****************************************************************************

export const INTERVALS = new Map([
	[ '1P', 0 ],
	[ '2m', 1 ], [ '2M', 2 ],
	[ '3m', 3 ], [ '3M', 4 ],
	[ '4P', 5 ], [ '4A', 6 ],
	[ '5d', 6 ], [ '5P', 7 ], [ '5A', 8 ],
	[ '6m', 8 ], [ '6M', 9 ],
	[ '7m', 10 ], [ '7M', 11 ],
	[ '8P', 12 ],
	[ '9m', 13 ], [ '9M', 14 ],
	[ '11P', 17 ], [ '11A', 18 ],
	[ '13m', 20 ], [ '13M', 21 ],
]);


// *****************************************************************************
// NOTE
// *****************************************************************************

export const SHARPS = [ 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B' ];
export const FLATS = [ 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B' ];

export const ENHARMONICS = [ 'C#|Db', 'D#|Eb', 'F#|Gb', 'G#|Ab', 'A#|Bb' ];

export const DIATONIC_NOTES = [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ];

