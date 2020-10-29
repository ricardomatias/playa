import { friendly, orderNotes, rankIntervals, rankScales } from '../../lib/tools/friendly';
import Random from '../../lib/tools/random';
import { Scale } from '../../lib/core/Scale';
import * as R from 'ramda';
import { stripOctave, valuesToArr } from '../../lib/utils';
import { ScaleIntervals } from '../../lib/constants';
import { Pull } from '../../lib/utils/types-guards';


const Cmaj = new Scale('C', Scale.Major);
const Abmaj = new Scale('Ab', Scale.Major);
const DSharpLoc = new Scale('D#', Scale.Locrian);
const BbEgyptian = new Scale('Bb', Scale.Intervals.Egyptian);

type Chromatic = Pull<typeof ScaleIntervals, 'Chromatic'>

type FriendlyScales = Exclude<ScaleIntervals, Chromatic>;

type isNotChromatic = (s: ScaleIntervals) => s is FriendlyScales

const isNotChromatic = R.complement(R.equals(ScaleIntervals.Chromatic)) as isNotChromatic;

const SCALES_ARRAY = R.filter(isNotChromatic, valuesToArr(ScaleIntervals));

describe('A Friendly test suite', () => {
	describe('classified list of neighboring scales', () => {
		it('should return [ `A`, `C#`, `G`, `B` ] ', () => {
			// given
			Random.setSeed('test');

			const neighbours = friendly([ 'A', 'C#', 'G', 'B' ]);

			expect(R.head(neighbours)).toEqual({
				scale: '1P 2M 3m 4P 5P 6m 7m',
				match: 1,
				root: 'B',
				intervals: '1P 2M 6m 7m',
				type: 'Minor',
			});

			expect(neighbours).toMatchSnapshot();
		});

		it('should return [ `F#`, `C#`, `D`, `D`, `E`, `C` ]', () => {
			// given
			Random.setSeed('test');

			const neighbours = friendly([ 'F#', 'C#', 'D', 'D', 'E', 'C' ]);

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
			Random.setSeed('test');

			const neighbours = friendly([ 'B', 'D', 'Eb', 'F', 'Ab' ]);

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
			Random.setSeed('test');

			// when
			const neighbours = friendly([ 'C#', 'F#' ]);

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

		it('should return 2 notes - [D, F#]', () => {
			// given
			Random.setSeed('test');

			// when
			const neighbours = friendly([ 'D', 'F#' ]);

			// then
			expect(neighbours).toMatchSnapshot();
		});

		it('should return an empty array when given 1 note', () => {
			// given
			Random.setSeed('test');

			// when
			const neighbours = friendly([ 'C#' ]);

			// then
			expect(neighbours).toEqual([]);
		});
	});

	describe('#rank', () => {
		it('should return an ordered list of intervals', () => {
			const ranking = rankIntervals(SCALES_ARRAY);

			expect(ranking).toEqual([
				'4A', '5d', '2m', '7M', '3M', '6m',
				'6M', '3m', '7m', '2M', '4P', '5P',
			]);
		});

		it('should return an ordered list of scales based on intervals ranking', () => {
			const intervalsRanking = rankIntervals(SCALES_ARRAY);

			const ranking = rankScales(intervalsRanking);

			expect(ranking['4A']).toEqual([ '1P 2M 3M 4A 5P 6M 7M' ]);
			expect(ranking['7m']).toHaveLength(9);
			expect(ranking['5P']).toHaveLength(13);
			expect(ranking).toMatchSnapshot();
		});
	});

	describe('#orderNotes', () => {
		beforeAll(() => Random.setSeed('FRIENDLY'));

		it('should order notes C MAJ', () => {
			const rndFn = () => (Random.int(1, -1));

			const scrambledNotes = R.sort(rndFn, Cmaj.string);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).toEqual(Cmaj.string.map(stripOctave));
		});

		it('should order notes Ab MAJ', () => {
			const rndFn = () => (Random.int(1, -1));

			const scrambledNotes = R.sort(rndFn, Abmaj.string);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).toEqual([
				'C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb',
			]);
		});

		it('should order notes D# LOCRIAN', () => {
			const rndFn = () => (Random.int(1, -1));

			const scrambledNotes = R.sort(rndFn, DSharpLoc.string);

			expect(scrambledNotes).toEqual([ 'E3', 'G#3', 'F#3', 'D#3', 'B3', 'C#4', 'A3' ]);

			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).toEqual([
				'C#', 'D#', 'E', 'F#', 'G#', 'A', 'B',
			]);
		});

		it('should order notes Bb EGYPTIAN', () => {
			const rndFn = () => (Random.int(1, -1));

			const scrambledNotes = R.sort(rndFn, BbEgyptian.string);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).toEqual([
				'C', 'Eb', 'F', 'Ab', 'Bb',
			]);
		});
	});
});
