/**
 * @param {String} chordName
 * @return {Object}
 */
export const deconstructName = (chordName) => {
	const reg = new RegExp(/(?:[A-G](#|b)?){0,2}/);

	let result = chordName.match(reg);

	const root = result[0];
	const type = chordName.replace(root, '');

	return { root, type };
};
