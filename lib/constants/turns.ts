/**
 * Scales
 * @memberof Constants
 */

/**
 * Turn
 * @memberof Constants
 * @typedef {string} TurnMoves
 */
export const TurnMoves = <const>{
	/**
 	* The start of a turn
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	* @constant
	*/
	Start: 'Start',
	/**
	* Modulate up in key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	* @constant
	*/
	ModeUp: 'ModeUp',
	/**
	* Modulate down in key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	* @constant
	*/
	ModeDown: 'ModeDown',
	/**
	* Stay in key during this turn
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	* @constant
	*/
	Keep: 'Keep',
	/**
	* Modulate down to another key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	* @constant
	*/
	ModulateDown: 'ModulateDown',
	/**
	* Modulate up to another key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	* @constant
	*/
	ModulateUp: 'ModulateUp',
	/**
	* Randomly picks any of the other turn movements
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	* @constant
	*/
	Free: 'Free',
};

export type TurnMoves = typeof TurnMoves[keyof typeof TurnMoves];
