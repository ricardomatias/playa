import { describe, it, expect, beforeAll } from 'vitest';
import * as R from 'ramda';
import {
	findMatchingKeys,
	orderNotes,
	rankIntervals,
	rankScales,
	findClosestMatches,
	MatchRanking,
} from '../../lib/analysis/matches';
import random from '../../lib/tools/random';
import { Scale } from '../../lib/core/Scale';
import { stripOctave, valuesToArr } from '../../lib/utils';
import { ScaleIntervals } from '../../lib/constants';
import { Pull } from '../../lib/utils/types-guards';
import { shuffle } from '../../lib/tools';
import '../matchers';

const Cmaj = new Scale('C', Scale.Major);
const Abmaj = new Scale('Ab', Scale.Major);
const DSharpLoc = new Scale('D#', Scale.Locrian);
const BbEgyptian = new Scale('Bb', Scale.Intervals.Egyptian);

type Chromatic = Pull<typeof ScaleIntervals, 'Chromatic'>;

type MatchingScales = Exclude<ScaleIntervals, Chromatic>;

type isNotChromatic = (s: ScaleIntervals) => s is MatchingScales;

const isNotChromatic = R.complement(R.equals(ScaleIntervals.Chromatic)) as isNotChromatic;

const SCALES_ARRAY = R.filter(isNotChromatic, valuesToArr(ScaleIntervals));

describe('A Friendly test suite', () => {
	describe('classified list of neighboring scales', () => {
		it('should return [ `A`, `C#`, `G`, `B` ] ', () => {
			// given
			random.setSeed('test');

			const neighbours = findMatchingKeys(['A3', 'C#3', 'G3', 'B3']);

			expect(R.head(neighbours)).toEqual({
				scale: '1P 2M 3m 4P 5P 6m 7m',
				match: 1,
				root: 'B',
				intervals: '1P 2M 6m 7m',
				type: 'Minor',
			});

			expect(neighbours).toMatchSnapshot();
		});

		// v2
		it.skip('should match with key even if root is missing', () => {
			// given
			random.setSeed('test');

			// when
			const neighbours = findMatchingKeys(['D', 'E', 'F', 'G', 'A', 'B']);

			// then
			expect(R.head(neighbours)).toEqual({
				scale: '1P 2M 3M 4P 5P 6M 7M',
				match: 1,
				root: 'C',
				intervals: '2M 3M 4P 5P 6M 7M',
				type: 'Major',
			});
		});

		it('should return [ `F#`, `C#`, `D`, `D`, `E`, `C` ]', () => {
			// given
			random.setSeed('test');

			const neighbours = findMatchingKeys(['F#', 'C#', 'D', 'D', 'E', 'C']);

			expect(R.head(neighbours)).toEqual({
				scale: '1P 2M 3M 4P 5P 6M 7m',
				match: 0.75,
				root: 'E',
				intervals: '1P 2M 6m 6M 7m',
				type: 'Mixolydian',
			});

			expect(neighbours).toMatchSnapshot();
		});

		it('should return [ `B`, `D`, `Eb`, `F`, `Ab` ]', () => {
			// given
			random.setSeed('test');

			const neighbours = findMatchingKeys(['B', 'D', 'Eb', 'F', 'Ab']);

			expect(R.head(neighbours)).toEqual({
				scale: '1P 2M 3m 4P 5P 6M 7m',
				match: 0.75,
				root: 'Ab',
				type: 'Dorian',
				intervals: '1P 3m 4A 5P 6M',
			});

			expect(neighbours).toMatchSnapshot();
		});

		it('should still return neighbours when given just 2 notes', () => {
			// given
			random.setSeed('test');

			// when
			const neighbours = findMatchingKeys(['C#', 'F#']);

			// then
			expect(R.head(neighbours)).toEqual({
				scale: '1P 2M 3M 4A 5P 6M 7M',
				match: 1,
				root: 'F#',
				type: 'Lydian',
				intervals: '1P 5P',
			});
			expect(neighbours).toMatchSnapshot();
		});

		it('should return D Aeolian ', () => {
			// given
			random.setSeed('test');

			const neighbours = findMatchingKeys(['D3', 'E3', 'F3', 'G3', 'A3', 'Bb3', 'C4']);

			expect(neighbours).toHaveMatch<MatchRanking>({
				match: 1,
				root: 'D',
				type: 'Minor',
			});

			expect(neighbours).toMatchSnapshot();
		});

		it('should return 2 notes - [D, F#]', () => {
			// given
			random.setSeed('test');

			// when
			const neighbours = findMatchingKeys(['D', 'F#']);

			// then
			expect(neighbours).toMatchSnapshot();
		});

		it('should return an empty array when given 1 note', () => {
			// given
			random.setSeed('test');

			// when
			const neighbours = findMatchingKeys(['C#']);

			// then
			expect(neighbours).toEqual([]);
		});
	});

	describe('#findClosestMatches', () => {
		it('should have a closest match', () => {
			// given
			random.setSeed('test');

			const match = findMatchingKeys(['A3', 'C#3', 'G3', 'B3'])[0];

			// then
			expect(match).toEqual({
				scale: '1P 2M 3m 4P 5P 6m 7m',
				match: 1,
				root: 'B',
				intervals: '1P 2M 6m 7m',
				type: 'Minor',
			});

			// given
			const candidates = findMatchingKeys(['A3', 'C#3', 'G3', 'F3']);

			// when
			const closest = findClosestMatches(match, candidates);

			// then
			expect(closest).toHaveLength(2);
			expect(closest[0]).toEqual({
				scale: '1P 2M 3M 4P 5P 6M 7m',
				match: 0.6666666666666666,
				root: 'A',
				intervals: '1P 3M 6m 7m',
				type: 'Mixolydian',
			});
			expect(new Scale(closest[0].root, closest[0].scale).pitches).toEqual(['A3', 'B3', 'C#4', 'D4', 'E4', 'F#4', 'G4']);
		});

		it('should have with every note different', () => {
			// given
			random.setSeed('test');

			const match = findMatchingKeys(['B', 'D', 'Eb', 'F', 'Ab'])[0];

			// then
			expect(match).toEqual({
				scale: '1P 2M 3m 4P 5P 6M 7m',
				match: 0.75,
				root: 'Ab',
				intervals: '1P 3m 4A 5P 6M',
				type: 'Dorian',
			});

			// given
			const candidates = findMatchingKeys(['C3', 'F#3', 'G3']);

			// when
			const closest = findClosestMatches(match, candidates);

			// then
			expect(closest).toHaveLength(1);

			// [ 'C3', 'Db3', 'Eb3', 'F3', 'G3', 'Ab3', 'Bb3' ]
			expect(new Scale(closest[0].root, closest[0].scale).pitches).toEqual(['C3', 'Db3', 'Eb3', 'F3', 'G3', 'Ab3', 'Bb3']);
		});
	});

	describe('#rank', () => {
		it('should return an ordered list of intervals', () => {
			const ranking = rankIntervals(SCALES_ARRAY);

			expect(ranking).toEqual(['4A', '5d', '2m', '7M', '3M', '6m', '6M', '3m', '7m', '2M', '4P', '5P']);
		});

		it('should return an ordered list of scales based on intervals ranking', () => {
			const intervalsRanking = rankIntervals(SCALES_ARRAY);

			const ranking = rankScales(intervalsRanking);

			expect(ranking['4A']).toEqual(['1P 2M 3M 4A 5P 6M 7M']);
			expect(ranking['7m']).toHaveLength(9);
			expect(ranking['5P']).toHaveLength(13);
			expect(ranking).toMatchSnapshot();
		});
	});

	describe('#orderNotes', () => {
		beforeAll(() => random.setSeed('FRIENDLY'));

		it('should order notes C MAJ', () => {
			const scrambledNotes = shuffle(Cmaj.pitches);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).toEqual(Cmaj.pitches.map(stripOctave));
		});

		it('should order notes Ab MAJ', () => {
			const scrambledNotes = shuffle(Abmaj.pitches);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).toEqual(['C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb']);
		});

		it('should order notes D# LOCRIAN', () => {
			const scrambledNotes = shuffle(DSharpLoc.pitches);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).toEqual(['C#', 'D#', 'E', 'F#', 'G#', 'A', 'B']);
		});

		it('should order notes Bb EGYPTIAN', () => {
			const scrambledNotes = shuffle(BbEgyptian.pitches);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).toEqual(['C', 'Eb', 'F', 'Ab', 'Bb']);
		});
	});
});
