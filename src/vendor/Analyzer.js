import Waveforms from './Waveforms';

var bufferLen = 256;

var waveform = Waveforms(bufferLen).random;

function hasTone() {
	return typeof window.Tone === "function";
}

const Analyser = function(container) {

	/**
	 *  the value below which it is considered silent
	 */
	this._silentThresh = 0.001;

	/**
	 *  The current RMS of the incoming signal
	 */
	this._rms = 0;

	/**
	 *  the container of the canvas
	 */
	this._container = container;

	/**
	 *  the canvas element
	 */
	this._element = document.createElement("canvas");
	this._element.id = "Canvas";
	container.appendChild(this._element);

	/**
	 *  the drawing context
	 */
	this._context = this._element.getContext("2d");

	//the analyser element
	if (hasTone()) {
		/**
		 *  The waveform analysis of the incoming signal
		 *  @type  {Tone.Waveform}
		 */
		this._analyser = new Tone.Waveform(bufferLen);

		/**
		 *  A signal to make the analyser rest
		 *  at 0 when nothing is connected
		 *  @private
		 */
		this._signal = new Tone.Zero().connect(this._analyser);

		//connect the master output to the analyser
		Tone.Master.connect(this._analyser);
	}

	if (hasTone()) {
		this._boundLoop = this._loop.bind(this);
		this._loop();
	}

	//resize initially
	this.resize();
};

Analyser.prototype.resize = function(width, height) {
	width = width || this._container.offsetWidth;
	height = height || this._container.offsetHeight;
	this._context.canvas.width = width * 2;
	this._context.canvas.height = height * 2;
	if (!hasTone()) {
		this._drawBuffer(waveform, true);
	}
};

Analyser.prototype._loop = function() {
	requestAnimationFrame(this._boundLoop);
	//if it's silent, draw a canned waveform when the mouse is over
	var analysis = this._analyser.getValue();
	if (this._isSilent(analysis)) {
		this._drawBuffer(waveform, true);
	} else { //if it's not silent, draw the waveform
		this._drawBuffer(analysis, false);
	}
};

/**
 *  Draw the given buffer onto the canvas
 */
Analyser.prototype._drawBuffer = function(buffer, silent) {
	var context = this._context;
	var width = this._context.canvas.width;
	var height = this._context.canvas.height;
	var margin;

	if (silent) {
		margin = this._scale(this._rms, 0, this._silentThresh, height * 0.2, height * 0.5);
	} else {
		margin = height * 0.2;
	}
	context.clearRect(0, 0, width, height);
	context.beginPath();

	var firstValue;

	for (var i = 0, len = buffer.length; i < len; i++) {
		var x = this._scale(i, 0, len - 1, 0, width);
		var y = this._scale(buffer[i], -1, 1, height - margin, margin);
		if (i === 0) {
			firstValue = y;
			context.moveTo(x, y);
		} else {
			context.lineTo(x, y);
		}
	}
	context.lineTo(width, height);
	context.lineTo(0, height);
	context.lineTo(0, firstValue);
	context.lineCap = "round";
	// context.stroke();
	context.fillStyle = "#22DBC0";
	context.fill();

};

/**
 *  True if the analyser analysis array is silent (all 0s)
 *  @private
 */
Analyser.prototype._isSilent = function(analysis) {
	//if the average is close to 128
	var total = 0;
	for (var i = 0; i < analysis.length; i++) {
		total += Math.pow(analysis[i], 2);
	}
	var rms = Math.sqrt(total / analysis.length);
	this._rms = Math.max(rms, this._rms * 0.9);
	return this._rms < this._silentThresh;
};

/**
 *  Scale a value from between the inputMin/Max to the outputMin/Max
 *  @private
 */
Analyser.prototype._scale = function(value, inputMin, inputMax, outputMin, outputMax) {
	var norm = (value - inputMin) / (inputMax - inputMin);
	return norm * (outputMax - outputMin) + outputMin;
};

export default Analyser;

