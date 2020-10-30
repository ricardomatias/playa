// 1nd - Dotted whole note - (2880 ticks)
// 1n - Whole note - (1920 ticks)
// 1nt - Whole note triplet - (1280 ticks)
// 2nd - Dotted half note - (1440 ticks)
// 2n - Half note - (960 ticks)
// 2nt - Half note triplet - (640 ticks)
// 4nd - Dotted quarter note - (720 ticks)
// 4n - Quarter note - (480 ticks)
// 4nt - Quarter note triplet - (320 ticks)
// 8nd - Dotted eighth note - (360 ticks)
// 8n - Eighth note - (240 ticks)
// 8nt - Eighth note triplet - (160 ticks)
// 16nd - Dotted sixteeth note - (180 ticks)
// 16n - Sixteeth note - (120 ticks)
// 16nt - Sixteeth note triplet - (80 ticks)
// 32nd - Dotted thirty - second note - (90 ticks)
// 32n - thirty - second note - (60 ticks)
// 32nt - thirty - second - note triplet - (40 ticks)
// 64nd - Dotted sixty - fourth note - (45 ticks)
// 64n - Sixty - fourth note - (30 ticks)
// 128n - One - hundred - twenty - eighth note - (15 ticks)

/**
 * Ticks in relation to note values (durations) with a PPQ (pulse per quarter) of 480
 * @memberof Constants
 * @typedef {number} Ticks
 * @enum
 * @example
 * Ticks['4n'] => 480
 */
export enum Ticks {
	'1nd' = 2880, '1n' = 1920, '1nt' = 1280,
	'2nd' = 1440, '2n' = 960, '2nt' = 640,
	'4nd' = 720, '4n' = 480, '4nt' = 320,
	'8nd' = 360, '8n' = 240, '8nt' = 160,
	'16nd' = 180, '16n' = 120, '16nt' = 80,
	'32nd' = 90, '32n' = 60, '32nt' = 40,
	'64nd' = 45, '64n' = 30,
	'128n' = 15
}

export type Notevalue = keyof typeof Ticks;

/**
 * Note values (duration)
 * @memberof Types
 * @typedef Notevalue
 * @property {string} 1nd "1nd"
 * @property {string} 1n "1n"
 * @property {string} 1nt "1nt"
 * @property {string} 2nd "2nd"
 * @property {string} 2n "2n"
 * @property {string} 2nt "2nt"
 * @property {string} 4nd "4nd"
 * @property {string} 4n "4n"
 * @property {string} 4nt "4nt"
 * @property {string} 8nd "8nd"
 * @property {string} 8n "8n"
 * @property {string} 8nt "8nt"
 * @property {string} 16nd "16nd"
 * @property {string} 16nt "16nt"
 * @property {string} 16n "16n"
 * @property {string} 32n "32n"
 * @property {string} 32nt "32t"
 * @property {string} 32n "32n"
 * @property {string} 64nd "64nd"
 * @property {string} 64n "64n"
 * @property {string} 128n "128n"
*/


