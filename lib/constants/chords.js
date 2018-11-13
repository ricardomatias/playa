
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

export const CHORDS = new Map([
	[ 'MAJOR', MAJOR_CHORD ],
	[ 'MINOR', MINOR_CHORD ],
	[ 'AUG', AUG_CHORD ],
	[ 'DIM', DIM_CHORD ],
	[ 'SUS2', SUS2_CHORD ],
	[ 'SUS4', SUS4_CHORD ],
	[ 'P5', P5_CHORD ],
	[ 'SEVEN', SEVEN_CHORD ],
	[ 'MINOR_SEVEN', MINOR_SEVEN_CHORD ],
	[ 'MINOR_SEVEN_FLAT_FIVE', MINOR_SEVEN_FLAT_FIVE_CHORD ],
	[ 'MAJOR_SEVEN', MAJOR_SEVEN_CHORD ],
	[ 'MAJOR_SIX', MAJOR_SIX_CHORD ],
	[ 'MINOR_SIX', MINOR_SIX_CHORD ],
	[ 'MINOR_SIX_ADD_NINE', MINOR_SIX_ADD_NINE_CHORD ],
	[ 'MAJOR_SIX_ADD_NINE', MAJOR_SIX_ADD_NINE_CHORD ],
	[ 'NINE', NINE_CHORD ],
	[ 'MINOR_NINE', MINOR_NINE_CHORD ],
	[ 'MAJOR_NINE', MAJOR_NINE_CHORD ],
	[ 'ELEVEN', ELEVEN_CHORD ],
	[ 'MINOR_ELEVEN', MINOR_ELEVEN_CHORD ],
	[ 'MAJOR_ELEVEN', MAJOR_ELEVEN_CHORD ],
	[ 'THIRTEEN', THIRTEEN_CHORD ],
	[ 'MINOR_THIRTEEN', MINOR_THIRTEEN_CHORD ],
	[ 'MAJOR_THIRTEEN', MAJOR_THIRTEEN_CHORD ],
]);

export const CHORDS_INTERVALS = new Map([
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
