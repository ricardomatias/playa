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
});
