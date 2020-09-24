expect.extend({
	toHaveMidiNotes(container, midi) {
		const pass = this.equals(container.midi, midi);
		return {
			message: () =>
				`expected ${container.midi} to be include ${midi}`,
			pass,
		};
	},
	toHaveStringNotes(container, str) {
		const pass = this.equals(container.string, str);
		return {
			message: () =>
				`expected ${container.string} to be include ${str}`,
			pass,
		};
	},
	toLastAround(container, totalDuration) {
		if (!Array.isArray(container)) {
			return {
				message: () =>
					`expected ${container} must be an Array`,
				pass: false,
			};
		}

		const lastEvent = container[container.length - 1];
		let pass = false;

		if (lastEvent.time === totalDuration) pass = true;
		if (lastEvent.time < totalDuration && lastEvent.next >= totalDuration) pass = true;

		return {
			message: () =>
				`expected to have a duration around ${totalDuration} but got ${lastEvent.next}`,
			pass,
		};
	},
});
