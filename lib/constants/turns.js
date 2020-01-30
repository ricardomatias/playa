/**
 * Scales
 * @memberof Constants
 */

/**
 * Turn
 * @memberof Constants
 * @namespace TurnMoves
 */
const TURN_MOVES = {
	/**
 	* The start of a turn
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	*/
	TURN_START: '▼',
	/**
	* Modulate up in key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	TURN_UP: '↑',
	/**
	* Modulate down in key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	TURN_DOWN: '↓',
	/**
	* Stay in key during this turn
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	TURN_KEEP: '➜',
	/**
	* Modulate down to another key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	TURN_MOD_DOWN: '⤥',
	/**
	* Modulate up to another key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	TURN_MOD_UP: '⤤',
	/**
	* Randomly picks any of the other turn movements
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	*/
	TURN_FREE: '⟷',
};

export const TURN_START = TURN_MOVES.TURN_START;
export const TURN_UP = TURN_MOVES.TURN_UP;
export const TURN_DOWN = TURN_MOVES.TURN_DOWN;
export const TURN_KEEP = TURN_MOVES.TURN_KEEP;
export const TURN_MOD_DOWN = TURN_MOVES.TURN_MOD_DOWN;
export const TURN_MOD_UP = TURN_MOVES.TURN_MOD_UP;
export const TURN_FREE = TURN_MOVES.TURN_FREE;

export { TURN_MOVES };
