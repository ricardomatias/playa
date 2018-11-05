// *****************************************************************************
// SCALES
// *****************************************************************************

// TODO: REMOVE DUPLICATED SCALES
const CHROMATIC_SCALE = '1P 2m 2M 3m 3M 4P 4A 5P 6m 6M 7m 7M';
const LYDIAN_SCALE = '1P 2M 3M 4A 5P 6M 7M';
const MAJOR_SCALE = '1P 2M 3M 4P 5P 6M 7M';
const IONIAN_SCALE = '1P 2M 3M 4P 5P 6M 7M';
const MIXOLYDIAN_SCALE = '1P 2M 3M 4P 5P 6M 7m';
const MINOR_SCALE = '1P 2M 3m 4P 5P 6m 7m';
const AEOLIAN_SCALE = '1P 2M 3m 4P 5P 6m 7m';
const DORIAN_SCALE = '1P 2M 3m 4P 5P 6M 7m';
const PHRYGIAN_SCALE = '1P 2m 3M 4M 5M 6m 7M';
const LOCRIAN_SCALE = '1P 2m 3m 4P 5d 6m 7m';
const MAJOR_PENTATONIC_SCALE = '1P 2M 3M 5P 6M';
const MINOR_PENTATONIC_SCALE = '1P 3m 4P 5P 7m';
const EGYPTIAN_SCALE = '1P 2M 4P 5P 7m';
const MELODIC_MINOR_SCALE = '1P 2M 3m 4P 5P 6M 7M';
const ALTERED_SCALE = '1P 2m 3m 3M 5d 6m 7m';
const HARMONIC_MINOR_SCALE = '1P 2M 3m 4P 5P 6m 7M';

export const SCALES = {
	CHROMATIC: CHROMATIC_SCALE,
	LYDIAN: LYDIAN_SCALE,
	MAJOR: MAJOR_SCALE,
	IONIAN: IONIAN_SCALE,
	MIXOLYDIAN: MIXOLYDIAN_SCALE,
	MINOR: MINOR_SCALE,
	AEOLIAN: AEOLIAN_SCALE,
	DORIAN: DORIAN_SCALE,
	PHRYGIAN: PHRYGIAN_SCALE,
	LOCRIAN: LOCRIAN_SCALE,
	MAJOR_PENTATONIC: MAJOR_PENTATONIC_SCALE,
	MINOR_PENTATONIC: MINOR_PENTATONIC_SCALE,
	EGYPTIAN: EGYPTIAN_SCALE,
	MELODIC_MINOR: MELODIC_MINOR_SCALE,
	ALTERED: ALTERED_SCALE,
	HARMONIC_MINOR: HARMONIC_MINOR_SCALE,
};

// *****************************************************************************
// CHORDS
// *****************************************************************************

const MAJOR_CHORD = 'maj';
const MINOR_CHORD = 'm';
const AUG_CHORD = 'aug';
const DIM_CHORD = 'dim';
const SUS2_CHORD = 'sus2';
const SUS4_CHORD = 'sus4';
const P5_CHORD = '5';
const SEVEN_CHORD = '7';
const MINOR_SEVEN_CHORD = 'm7';
const MINOR_SEVEN_FLAT_FIVE_CHORD = 'm7b5';
const MAJOR_SEVEN_CHORD = 'M7';
const MAJOR_SIX_CHORD = '6';
const MINOR_SIX_CHORD = 'm6';
const MINOR_SIX_ADD_NINE_CHORD = 'm6add9';
const MAJOR_SIX_ADD_NINE_CHORD = '6add9';
const NINE_CHORD = '9';
const MINOR_NINE_CHORD = 'm9';
const MAJOR_NINE_CHORD = 'M9';
const ELEVEN_CHORD = '11';
const MINOR_ELEVEN_CHORD = 'm11';
const MAJOR_ELEVEN_CHORD = 'M11';
const THIRTEEN_CHORD = '13';
const MINOR_THIRTEEN_CHORD = 'm13';
const MAJOR_THIRTEEN_CHORD = 'M13';

export const CHORDS = {
	MAJOR: MAJOR_CHORD,
	MINOR: MINOR_CHORD,
	AUG: AUG_CHORD,
	DIM: DIM_CHORD,
	SUS2: SUS2_CHORD,
	SUS4: SUS4_CHORD,
	P5: P5_CHORD,
	SEVEN: SEVEN_CHORD,
	MINOR_SEVEN: MINOR_SEVEN_CHORD,
	MINOR_SEVEN_FLAT_FIVE: MINOR_SEVEN_FLAT_FIVE_CHORD,
	MAJOR_SEVEN: MAJOR_SEVEN_CHORD,
	MAJOR_SIX: MAJOR_SIX_CHORD,
	MINOR_SIX: MINOR_SIX_CHORD,
	MINOR_SIX_ADD_NINE: MINOR_SIX_ADD_NINE_CHORD,
	MAJOR_SIX_ADD_NINE: MAJOR_SIX_ADD_NINE_CHORD,
	NINE: NINE_CHORD,
	MINOR_NINE: MINOR_NINE_CHORD,
	MAJOR_NINE: MAJOR_NINE_CHORD,
	ELEVEN: ELEVEN_CHORD,
	MINOR_ELEVEN: MINOR_ELEVEN_CHORD,
	MAJOR_ELEVEN: MAJOR_ELEVEN_CHORD,
	THIRTEEN: THIRTEEN_CHORD,
	MINOR_THIRTEEN: MINOR_THIRTEEN_CHORD,
	MAJOR_THIRTEEN: MAJOR_THIRTEEN_CHORD,
};

export const CHORDS_MAP = new Map([
	[ '', [ '1P 3M 5P' ] ],
	[ MAJOR_CHORD, [ '1P 3M 5P' ] ],

	[ MINOR_CHORD, [ '1P 3m 5P' ] ],

	[ AUG_CHORD, [ '1P 3M 5A' ] ],
	[ DIM_CHORD, [ '1P 3m 5d' ] ],

	[ SUS2_CHORD, [ '1P 2M 5P' ] ],
	[ SUS4_CHORD, [ '1P 4P 5P' ] ],

	[ P5_CHORD, [ '1P 5P' ] ],

	[ SEVEN_CHORD, [ '1P 3M 5P 7m', [ 'maj', '7m' ] ] ],
	[ MINOR_SEVEN_CHORD, [ '1P 3m 5P 7m', [ 'm', '7m' ] ] ],
	[ MINOR_SEVEN_FLAT_FIVE_CHORD, [ '1P 3m 5d 7m', [ 'dim', '7m' ] ] ],
	[ MAJOR_SEVEN_CHORD, [ '1P 3M 5P 7M', [ 'maj', '7M' ] ] ],

	[ MAJOR_SIX_CHORD, [ '1P 3M 5P 6M', [ 'maj', '6M' ] ] ],
	[ MINOR_SIX_CHORD, [ '1P 3m 5P 6M', [ 'min', '6M' ] ] ],
	[ MINOR_SIX_ADD_NINE_CHORD, [ '1P 3M 5P 6m 9M', [ 'm', '6m 9M' ] ] ],
	[ MAJOR_SIX_ADD_NINE_CHORD, [ '1P 3M 5P 6M 9M', [ 'maj', '6M 9M' ] ] ],

	[ NINE_CHORD, [ '1P 3M 5P 7m 9M', [ '7', '9M' ] ] ],
	[ MINOR_NINE_CHORD, [ '1P 3m 5P 7m 9M', [ 'm7', '9M' ] ] ],
	[ MAJOR_NINE_CHORD, [ '1P 3M 5P 7M 9M', [ 'M7', '9M' ] ] ],

	[ ELEVEN_CHORD, [ '1P 3M 5P 7m 9M 11P', [ '9', '11P' ] ] ],
	[ MINOR_ELEVEN_CHORD, [ '1P 3m 5P 7m 9M 11P', [ 'm9', '11P' ] ] ],
	[ MAJOR_ELEVEN_CHORD, [ '1P 3M 5P 7M 9M 11P', [ 'M9', '11P' ] ] ],

	[ THIRTEEN_CHORD, [ '1P 3M 5P 7m 9M 13M', [ '11', '13M' ] ] ],
	[ MINOR_THIRTEEN_CHORD, [ '1P 3m 5P 7m 9M 13M', [ 'm11', '13M' ] ] ],
	[ MAJOR_THIRTEEN_CHORD, [ '1P 3M 5P 7M 9M 13M', [ 'M11', '13M' ] ] ],
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

