function waveforms(bufferLength) {
	var sine = new Array(bufferLength);
	var square = new Array(bufferLength);
	var sawtooth = new Array(bufferLength);
	var triangle = new Array(bufferLength);

	var choices = [sine, sawtooth, triangle, square];


	var i;
	for (i = 0; i < bufferLength; i++) {
		sine[i] = Math.sin(Math.PI * 2 * i / bufferLength);
	}

	for (i = 0; i < bufferLength; i++) {
		sawtooth[i] = (((i + bufferLength / 2) % bufferLength) / bufferLength) * 2 - 1;
	}

	for (i = 0; i < bufferLength; i++) {
		if (i < bufferLength / 3) {
			triangle[i] = i / (bufferLength / 3) * 2 - 1;
		} else if (i < bufferLength * 2 / 3) {
			triangle[i] = (1 - (i - bufferLength / 3) / (bufferLength / 3)) * 2 - 1;
		} else {
			triangle[i] = (i - bufferLength * 2 / 3) / (bufferLength / 3) * 2 - 1;
		}
	}

	for (i = 0; i < bufferLength; i++) {
		var margin = bufferLength / 16;
		if (i < margin) {
			square[i] = -1;
		} else if (i < bufferLength / 2) {
			square[i] = 1;
		} else if (i < (bufferLength - margin)) {
			square[i] = -1;
		} else {
			square[i] = 1;
		}
	}

	var random = choices[Math.floor(Math.random() * choices.length)];

	return {
		sawtooth: sawtooth,
		sine: sine,
		triangle: triangle,
		square: square,
		random: random
	};
};

export default waveforms;
