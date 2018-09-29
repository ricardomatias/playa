import Tone from 'tone';
import { Chord } from 'playa/core';

const am7 = new Chord('Am7');

const distortion = new Tone.Distortion(0.6);
const tremolo = new Tone.Tremolo().start();
const polySynth = new Tone.PolySynth(4, Tone.Synth).chain(distortion, tremolo, Tone.Master);

document.querySelector('#chord').addEventListener('mousedown', () => {
	polySynth.triggerAttack(am7.notes);
});

document.querySelector('#chord').addEventListener('mouseup', () => {
	polySynth.triggerRelease(am7.notes);
});
