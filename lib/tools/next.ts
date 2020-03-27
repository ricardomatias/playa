export const next = <T>(arr: T[], alternate = false): () => T => {
	const maxIdx = arr.length - 1;
	let idx = 0;
	let dir = 1;

	return () => {
		if (alternate) {
			if (idx >= maxIdx || (idx <= 0 && dir < 0)) {
				dir *= -1.0;
			}
		} else {
			if (idx > maxIdx) idx = 0;
		}

		const elem = arr[idx];

		idx += dir;

		return elem;
	};
};
