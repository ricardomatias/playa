/**
 * Custom Error
 * @private
 *
 * @class
 * @memberof Utils
 *
 * @name PlayaError
 * @extends {Error}
 */
class PlayaError extends Error {
	/**
	 * Creates an instance of PlayaError.
	 * @constructs PlayaError
	 * @memberof Utils
 	 * @private
	 *
	 * @param {String} name
	 * @param {String} [message]
	 * @param {Object} Object { error, ...context }
	 */
	constructor(name, message, { error = {}, ...context } = {}) {
		super(error);

		this.name = name;

		if (message) {
			this.message = message;
		}

		if (context) {
			this.context = context;
		}

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, PlayaError);
		}
	}

	toString() {
		return `[${this.name}] ${this.message}\n ${JSON.stringify(this.context, null, '\t')}`;
	}
}

export default PlayaError;
