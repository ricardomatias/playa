/* eslint new-cap: 0 */

import Tone from 'tone';
import Interface from 'Interface';

window.Tone = Tone;

Tone.Transport.bpm.value = 102;
Tone.Transport.timeSignature = [ 3, 4 ];

document.addEventListener('DOMContentLoaded', () => {
	Interface.Transport();
});

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
	}
});

let synthB = new Tone.Synth({
	oscillator: {
		type: 'triangle8',
	},
	envelope: {
		attack: 2,
		decay: 1,
		sustain: 0.4,
		release: 4,
	},
}).toMaster();

/**
 *
 *
 * @param {*} time
 */
function triggerSynth(time) {
	// the time is the sample-accurate time of the event
	synthB.triggerAttackRelease('C3', '8n', time);
}

Tone.Transport.schedule(triggerSynth, 0);

// set the transport to repeat
let synth = new Tone.Synth().toMaster();

// pass in an array of events
let part = new Tone.Part(function(time, event) {
	// the events will be given to the callback with the time they occur
	synth.triggerAttackRelease(event.note, event.dur, time);
}, [ { time: 0, note: 'C4', dur: '4n' },
	{ time: '4n + 8n', note: 'E4', dur: '8n' },
	{ time: '2n', note: 'G4', dur: '16n' },
	{ time: '2n + 8t', note: 'B4', dur: '4n' } ]);

// start the part at the beginning of the Transport's timeline
part.start(0);

// loop the part 3 times

// /**
//  *  PIANO
//  */
// let piano = new Tone.PolySynth(4, Tone.Synth, {
// 	'volume': -8,
// 	'oscillator': {
// 		'partials': [ 1, 2, 1 ],
// 	},
// 	'portamento': 0.05,
// }).toMaster();

// let c = chord('C');
// let d = chord('D6');
// let g = chord('G7', [ 3 ]);

// let pianoPart = new Tone.Part(function(time, chord) {
// 	piano.triggerAttackRelease(chord, '8n', time);
// }, [
// 	[ '0:0:0', c.str ], [ '0:1', c.str ], [ '0:1:3', d.str ],
// 	[ '0:2:2', c.str ], [ '0:3', c.str ], [ '0:3:2', g.str ] ]).start();

// pianoPart.loop = true;
// pianoPart.loopEnd = '1m';
// pianoPart.humanize = true;

