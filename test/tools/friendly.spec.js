import friendly, { orderNotes, rankIntervals, rankScales } from '../../lib/tools/friendly';
import { seedRandom, randomInt } from '../../lib/tools';
import Scale from '../../lib/core/Scale';
import NoteType from '../../lib/core/types';
import * as R from 'ramda';

const NOTE_STR = { noteType: NoteType.STR };

const Cmaj = new Scale('C', Scale.MAJOR, NOTE_STR);
const Abmaj = new Scale('Ab', Scale.MAJOR, NOTE_STR);
const DSharpLoc = new Scale('D#', Scale.LOCRIAN, NOTE_STR);
const BbEgyptian = new Scale('Bb', Scale.EGYPTIAN, NOTE_STR);

const SCALES_ARRAY = Array.from(Scale.SCALES.values());

describe('A Friendly test suite', () => {
	describe('classified list of neighboring scales', () => {
		it('should return [ `A`, `C#`, `G`, `B` ] ', () => {
			const neighbours = friendly([ 'A', 'C#', 'G', 'B' ]);

			expect(R.head(neighbours['A'])).to.eql({
				scale: '1P 2M 3M 4P 5P 6M 7m', match: 1, type: 'MIXOLYDIAN',
			});

			expect(R.head(neighbours['G'])).to.eql({
				scale: '1P 2M 3M 4A 5P 6M 7M', match: 1, type: 'LYDIAN',
			});
		});

		it('should return [ `F#`, `C#`, `D`, `D`, `E`, `C` ]', () => {
			const neighbours = friendly([ 'F#', 'C#', 'D', 'D', 'E', 'C' ]);

			expect(R.head(neighbours['E'])).to.eql({
				scale: '1P 2M 3M 4P 5P 6M 7m', match: 0.75, type: 'MIXOLYDIAN',
			});

			expect(R.take(2, neighbours['C#'])).to.eql([
				{ scale: '1P 2m 3m 4P 5d 6m 7m', match: 0.75, type: 'LOCRIAN' },
				{ scale: '1P 2M 3M 4P 5P 6M 7M', match: 0.5, type: 'IONIAN' },
			]);
		});

		it('should return [ `B`, `D`, `Eb`, `F`, `Ab` ]', () => {
			const neighbours = friendly([ 'B', 'D', 'Eb', 'F', 'Ab' ]);

			expect(R.head(neighbours['D'])).to.eql(
				{ scale: '1P 2M 3M 4A 5P 6M 7M', match: 0.5, type: 'LYDIAN' }
			);
		});
	});

	describe('#rank', () => {
		it('should return an ordered list of intervals', () => {
			const ranking = rankIntervals(SCALES_ARRAY);

			expect(ranking).to.eql([
				'4A', '5d', '2m', '6m', '7M', '3M',
				'6M', '3m', '7m', '2M', '4P', '5P',
			]);
		});

		it('should return an ordered list of scales based on intervals ranking', () => {
			const intervalsRanking = rankIntervals(SCALES_ARRAY);

			const ranking = rankScales(intervalsRanking);

			expect(ranking['4A']).to.eql([ '1P 2M 3M 4A 5P 6M 7M' ]);
			expect(ranking['7m']).to.have.length(8);
			expect(ranking['5P']).to.have.length(13);
		});
	});

	describe('#orderNotes', () => {
		before(() => seedRandom('FRIENDLY'));

		it('should order notes C MAJ', () => {
			const rndFn = () => (randomInt(1, -1));

			const scrambledNotes = R.sort(rndFn, Cmaj.notes);

			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).to.eql(Cmaj.notes);
		});

		it('should order notes Ab MAJ', () => {
			const rndFn = () => (randomInt(1, -1));

			const scrambledNotes = R.sort(rndFn, Abmaj.notes);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).to.eql([
				'C', 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb',
			]);
		});

		it('should order notes D# LOCRIAN', () => {
			const rndFn = () => (randomInt(1, -1));

			const scrambledNotes = R.sort(rndFn, DSharpLoc.notes);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).to.eql([
				'C#', 'D#', 'E', 'F#', 'G#', 'A', 'B',
			]);
		});

		it('should order notes Bb EGYPTIAN', () => {
			const rndFn = () => (randomInt(1, -1));

			const scrambledNotes = R.sort(rndFn, BbEgyptian.notes);
			const neighbours = orderNotes(scrambledNotes);

			expect(neighbours).to.eql([
				'C', 'Eb', 'F', 'Ab', 'Bb',
			]);
		});
	});
});
