const ACCIDENT_REGEXP = new RegExp('#|b');

export const whichAccident = (note) => {
	const exec = ACCIDENT_REGEXP.exec(note);

	return exec ? exec[0] : null;
};

export const natural = (note) => {
	if (typeof note !== 'string') {
		return note.note.replace(ACCIDENT_REGEXP, '');
	}

	return note.replace(ACCIDENT_REGEXP, '');
};
