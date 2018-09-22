import Tone from 'tone';
import { Chord } from 'playa';

const am7 = new Chord('Am7').n.map((note) => `${note}4`);

const distortion = new Tone.Distortion(0.6);
const tremolo = new Tone.Tremolo().start();
const polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master);

document.querySelector('#chord').addEventListener('mousedown', () => {
	polySynth.triggerAttack(am7);
});

document.querySelector('#chord').addEventListener('mouseup', () => {
	polySynth.triggerRelease(am7);
});
