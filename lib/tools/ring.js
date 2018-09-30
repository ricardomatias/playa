const handler = {
	getPrototypeOf(target) {
		return Array.prototype;
	},
	get(target, key, receiver) {
		const listLen = target.length;

		if (key in Array.prototype) {
			return function(...args) {
				return Array.prototype[key].apply(target, args);
			};
		}

		let idx = parseInt(key, 10);

		if (idx < 0) {
			idx = listLen + idx;
		} else
		if (idx > listLen - 1) {
			idx = idx % listLen;
		}

		return Reflect.get(target, idx, receiver);
	},
	set(target, key, value, receiver) {
		return Reflect.set(target, key, value, receiver);
	},
};

const ring = (list) => {
	const listLen = list.length;

	if (!listLen) {
		return;
	}

	return new Proxy([].concat(list), handler);
};

export default ring;
