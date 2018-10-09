const shuffle = (list) => {
	for (let index = 0; index < 10; index++) {
		list.sort(() => Math.floor(Math.random() * 3 - 1));
	}
};

export default shuffle;
