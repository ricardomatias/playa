import * as R from 'ramda';
import { createChordProgression, createMelodies, createMovement } from '../../lib/composition';
import { Key } from '../../lib/core';
import random from '../../lib/tools/random';
import { SongAnalysis } from '../../lib/analysis/song';
import { toNoteEvent } from '../../lib/core/utils';
import { ScaleIntervals } from '../../lib/constants';
import '../matchers';

describe('A Song Analysis test suite', () => {
	beforeEach(random.reset);

	it('should find matches with 1 key', () => {
		random.setSeed('test');

		// given
		const fMin = new Key('F', Key.Minor);

		// when
		const movement = createMovement(fMin, '4:0:0', 4, {
			modProb: 0,
		});

		const melodies = createMelodies(movement.timeline);
		const chordProg = createChordProgression(movement.timeline);

		const song = R.sortBy(R.prop('time'), melodies.concat(chordProg.map(toNoteEvent).flat()));
		const analysis = new SongAnalysis(song);

		// then
		expect(analysis.matches).toHaveLength(1);
		expect(analysis.matches[0]).toHaveKeyMatch(movement.timeline[0].key);
	});

	it('should find matches with 2 keys', () => {
		random.setSeed('test');

		// given
		const bFlatMaj = new Key('Bb', Key.Major);

		// when
		const movement = createMovement(bFlatMaj, '8:0:0', 2, {
			modProb: 1,
		});

		const melodies = createMelodies(movement.timeline);
		const chordProg = createChordProgression(movement.timeline);

		const song = R.sortBy(R.prop('time'), melodies.concat(chordProg.map(toNoteEvent).flat()));

		const analysis = new SongAnalysis(song);
		const matches = analysis.matches;

		// then
		expect(matches).toHaveLength(2);
		expect(matches[0]).toHaveKeyMatch(movement.timeline[0].key);
		expect(matches[1]).toHaveKeyMatch(movement.timeline[1].key);
	});

	it('should find with 3 keys basic', () => {
		random.setSeed('test-song', 100);

		// given
		const dAeolian = new Key('D', Key.Aeolian);

		// when
		const movement = createMovement(dAeolian, '16:0:0', 3, {
			modProb: 1,
		});

		const melodies = createMelodies(movement.timeline);
		const chordProg = createChordProgression(movement.timeline);

		const song = R.sortBy(R.prop('time'), melodies.concat(chordProg.map(toNoteEvent).flat()));

		const { matches } = new SongAnalysis(song);

		// then
		expect(matches.length).toEqual(3);

		expect(matches[0]).toHaveKeyMatch(movement.timeline[0].key);
		expect(matches[1]).toHaveKeyMatch(movement.timeline[1].key);
		expect(matches[2]).toHaveKeyMatch(movement.timeline[2].key);
	});

	it('should find with 3 keys short', () => {
		random.setSeed('test');

		// given
		const dAeolian = new Key('D', Key.Aeolian);

		// when
		const movement = createMovement(dAeolian, '6:0:0', 3, {
			modProb: 1,
		});

		const melodies = createMelodies(movement.timeline);
		const chordProg = createChordProgression(movement.timeline);

		const song = R.sortBy(R.prop('time'), melodies.concat(chordProg.map(toNoteEvent).flat()));

		const analysis = new SongAnalysis(song);
		const matches = analysis.matches;

		// then
		// should be 3
		expect(matches).toHaveLength(3);

		// should be D - Aeolian
		expect(matches[0]).toHaveKeyMatch({
			root: 'D',
			scale: ScaleIntervals.Minor,
		});

		expect(movement.timeline[0].key).toEqual({
			root: 'D',
			scale: ScaleIntervals.Minor,
		});
	});

	it('should find with 4 keys medium', () => {
		random.setSeed('test');

		// given
		const eFlatMajor = new Key('Eb', Key.Major);

		// when
		const movement = createMovement(eFlatMajor, '16:0:0', 4, {
			modProb: 1,
		});

		const melodies = createMelodies(movement.timeline);
		const chordProg = createChordProgression(movement.timeline);

		const song = R.sortBy(R.prop('time'), melodies.concat(chordProg.map(toNoteEvent).flat()));

		const analysis = new SongAnalysis(song);
		const matches = analysis.matches;

		// then
		expect(matches).toHaveLength(4);

		expect(matches[0]).toHaveMatch(movement.timeline[0].key);
		expect(matches[1]).toHaveMatch(movement.timeline[1].key);
		expect(matches[2]).toHaveMatch(movement.timeline[2].key);
		expect(matches[3]).toHaveMatch(movement.timeline[3].key);
	});

	it('should find with 4 keys long', () => {
		random.setSeed('test-2');

		// given
		const aMixo = new Key('A', Key.Mixolydian);

		// when
		const movement = createMovement(aMixo, '29:0:0', 4, {
			modProb: 0.5,
		});

		const melodies = createMelodies(movement.timeline);
		const chordProg = createChordProgression(movement.timeline);

		const song = R.sortBy(R.prop('time'), melodies.concat(chordProg.map(toNoteEvent).flat()));

		const { matches } = new SongAnalysis(song);

		expect(matches).toHaveLength(3);

		expect(matches[0]).toHaveKeyMatch(movement.timeline[0].key);
		expect(matches[1]).toHaveKeyMatch(movement.timeline[1].key);

		// TODO Is true but different accidental, need to add accidental check to matcher
		expect(matches[2]).toHaveKeyMatch(movement.timeline[3].key);
	});
});
