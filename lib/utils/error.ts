/**
 * Custom Error
 * @private
 *
 * @class
 * @memberof Utils
 *
 * @extends {Error}
 */
export class PlayaError extends Error {
	context: any = {};
	/**
	 * Creates an instance of PlayaError.
	 * @constructs PlayaError
	 * @memberof Utils
	 * @private
	 *
	 * @param {String} name
	 * @param {String} [message]
	 * @param {Object} [context] { context }
	 */
	constructor(name: string, message: string, context = {}) {
		super(message);

		this.name = `[PlayaError <${name}>]`;

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
