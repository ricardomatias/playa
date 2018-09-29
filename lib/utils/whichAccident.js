import memoize from 'fast-memoize';

export default memoize((note) => {
	const exec = new RegExp('#|b').exec(note);

	return exec ? exec[0] : null;
});
