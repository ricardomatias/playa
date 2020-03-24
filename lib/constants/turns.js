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
	START: '▼',
	/**
	* Modulate up in key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	UP: '↑',
	/**
	* Modulate down in key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	DOWN: '↓',
	/**
	* Stay in key during this turn
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	KEEP: '➜',
	/**
	* Modulate down to another key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	MOD_DOWN: '⤥',
	/**
	* Modulate up to another key
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
 	* @readonly
	*/
	MOD_UP: '⤤',
	/**
	* Randomly picks any of the other turn movements
	* @type {String}
	* @memberof Constants.TurnMoves
	* @default
	* @readonly
	*/
	FREE: '⟷',
};

export const TURN_START = TURN_MOVES.START;
export const TURN_UP = TURN_MOVES.UP;
export const TURN_DOWN = TURN_MOVES.DOWN;
export const TURN_KEEP = TURN_MOVES.KEEP;
export const TURN_MOD_DOWN = TURN_MOVES.MOD_DOWN;
export const TURN_MOD_UP = TURN_MOVES.MOD_UP;
export const TURN_FREE = TURN_MOVES.FREE;

export { TURN_MOVES };
