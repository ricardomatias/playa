const whichAccident = note => {
	const exec = new RegExp('#|b').exec(note);

	return exec ? exec[0] : null;
};

const notesToString = notes => {
	return notes.map(note => (note.n));
};

// TODO: Create Prototype class and add these methods
module.exports = {
	whichAccident,
	notesToString
};
