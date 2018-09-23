const ring = (list) => {
	const listLen = list.length;

	if (!listLen) {
		return;
	}

	const newList = list.reduce((list, curr, idx) => {
		list[idx] = curr;

		return list;
	}, {});

	const handler = {
		get(target, key) {
			const idx = parseInt(key, 10);

			if (target[idx]) {
				return target[idx];
			}

			if (idx < 0) {
				return target[listLen + idx];
			}

			if (idx > listLen - 1) {
				return target[idx % listLen];
			}
		},
	};

	return new Proxy(newList, handler);
};

export default ring;
