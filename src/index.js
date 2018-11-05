/* eslint new-cap: 0, no-console: 0 */

import Tone from 'tone/Tone';
import WebMidi from 'webmidi';
import Interface from 'Interface';
import Waveform from 'Waveform';
import { motif, chord } from 'playa/functional';
import { motifs, ring } from 'playa/tools';

window.Tone = Tone;

Waveform(document.querySelector('#tone-container'));

const { normal } = motifs;

Tone.Transport.bpm.value = 102;
Tone.Transport.timeSignature = [ 4, 4 ];

let drumCompress = new Tone.Compressor({
	'threshold': -10,
	'ratio': 4,
	'attack': 0.3,
	'release': 0.1,
}).toMaster();

let kick = new Tone.MembraneSynth({
	'pitchDecay': 0.01,
	'octaves': 6,
	'oscillator': {
		'type': 'square4',
	},
	'envelope': {
		'attack': 0.001,
		'decay': 0.2,
		'sustain': 0,
	},
}).connect(drumCompress);

let kickPart = new Tone.Part(function(time, event) {
	kick.triggerAttack('C1', time);
}, [ 0, 'C1' ]);

Tone.Master.volume.rampTo(2, 0);

kickPart.start(0);

kickPart.loop = true;
kickPart.loopEnd = '4n';

document.addEventListener('DOMContentLoaded', () => {
	console.log('FOOOOO');
	Interface.Transport();
});


WebMidi.enable(function(err) {
	if (err) {
		return;
	}

	console.log(WebMidi.inputs);
	console.log(WebMidi.outputs);

	let clarett = WebMidi.getOutputByName('Clarett 4Pre USB');

	// bpm slider
	document.querySelector('#bpm').addEventListener('input', function(e) {
		Tone.Transport.bpm.value = parseInt(e.target.value);
	});

	// Transport
	document.querySelector('.playToggle').addEventListener('change', function(e) {
		if (e.target.checked) {
			Tone.Transport.start('+0.1');
		} else {
			Tone.Transport.stop();
			clarett.stopNote('all');
		}
	});

	if (!clarett) {
		return;
	}

	let m1 = ring(motif(chord('Am').notes, '1:0:0', normal));
	console.log(JSON.stringify(m1, null, '\t'));

	// pass in an array of events
	let part = new Tone.Part(function(time, event) {
		const prevEvent = m1[m1.indexOf(event) - 1];

		clarett.stopNote(prevEvent.note);
		clarett.playNote(event.note);
		// the events will be given to the callback with the time they occur
		// synth.triggerAttackRelease(event.note, event.dur, time, 0.7);
	}, m1);

	let m2 = ring(motif(chord('Dm', [ 3, 2 ]).notes, '0:3:0', normal));

	console.log(JSON.stringify(m2, null, '\t'));

	let part2 = new Tone.Part(function(time, event) {
		// the events will be given to the callback with the time they occur
		const prevEvent = m2[m1.indexOf(event) - 1];

		clarett.stopNote(prevEvent.note);
		clarett.playNote(event.note);
		// synthB.triggerAttackRelease(event.note, event.dur, time, 0.5);
	}, m2);

	part.start(0);

	part.loop = true;
	part.loopEnd = '1m';
	part.humanize = true;

	part2.start('0:2:0');

	part2.loop = true;
	part2.loopEnd = '2n';
	part2.humanize = true;
});

