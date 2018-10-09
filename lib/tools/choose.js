const choose = (list) => {
	const len = list.length;
	const index = Math.floor((Math.random() * len));

	return list[index];
};

export default choose;
