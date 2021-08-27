import * as R from 'ramda';
import { createChordProgression, createMelodies, createMovement } from '../../lib/composition';
import { Key } from '../../lib/core';
import random from '../../lib/tools/random';
import { SongAnalysis } from '../../lib/analysis/song';
import { MatchRanking } from '../../lib/analysis/matches';
import { toNoteEvent } from '../../lib/core/utils';
import { ScaleIntervals } from '../../lib/constants';
import '../matchers';

describe('A Song Analysis test suite', () => {
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
		expect(analysis.matches[0]).toHaveMatch<MatchRanking>({
			root: 'F',
			type: 'Minor',
		});
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
		expect(matches[0]).toHaveMatch<MatchRanking>({
			root: 'Bb',
			type: 'Major',
		});
		expect(matches[1]).toHaveMatch<MatchRanking>({
			root: 'F',
			type: 'Major',
		});
	});

	it('should find with 3 keys basic', () => {
		random.setSeed('test-song');

		// given
		const dAeolian = new Key('D', Key.Aeolian);

		// when
		const movement = createMovement(dAeolian, '16:0:0', 3, {
			modProb: 1,
		});

		const melodies = createMelodies(movement.timeline);
		const chordProg = createChordProgression(movement.timeline);

		const song = R.sortBy(R.prop('time'), melodies.concat(chordProg.map(toNoteEvent).flat()));

		const analysis = new SongAnalysis(song);
		const matches = analysis.matches;

		// then
		expect(matches).toHaveLength(3);

		expect(matches[0]).toHaveMatch<MatchRanking>({
			root: 'D',
			scale: ScaleIntervals.Aeolian,
		});
		expect(matches[1]).toHaveMatch<MatchRanking>({
			root: 'A',
			scale: ScaleIntervals.Aeolian,
		});
		expect(matches[2]).toHaveMatch<MatchRanking>({
			root: 'E',
			scale: ScaleIntervals.Minor,
		});
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
		expect(matches).toHaveLength(1);

		// should be D - Aeolian
		expect(matches[0]).toHaveMatch<MatchRanking>({
			root: 'D',
			scale: ScaleIntervals.Dorian,
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

		expect(matches[0]).toHaveMatch<MatchRanking>({
			root: 'Eb',
			scale: ScaleIntervals.Major,
		});
		expect(matches[1]).toHaveMatch<MatchRanking>({
			root: 'Bb',
			scale: ScaleIntervals.Major,
		});

		// should be C - Major
		expect(matches[2]).toHaveMatch<MatchRanking>({
			root: 'F',
			scale: ScaleIntervals.Major,
		});
		expect(matches[3]).toHaveMatch<MatchRanking>({
			root: 'Ab',
			scale: ScaleIntervals.Major,
		});
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

		const analysis = new SongAnalysis(song);
		const matches = analysis.matches;

		expect(matches).toHaveLength(3);

		expect(matches[0]).toHaveMatch<MatchRanking>({
			root: 'A',
			scale: ScaleIntervals.Mixolydian,
		});
		expect(matches[1]).toHaveMatch<MatchRanking>({
			root: 'F#',
			scale: ScaleIntervals.Minor,
		});
		expect(matches[1]).toHaveMatch<MatchRanking>({
			root: 'C#',
			scale: ScaleIntervals.Phrygian,
		});
	});
});
