class PlayaError extends Error {
	constructor(name, message, { error, ...context }) {
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
