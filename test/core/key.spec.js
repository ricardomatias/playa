import Key from '../../lib/core/Key';
import Scale from '../../lib/core/Scale';
import NoteType from '../../lib/core/types';

const TEST = { noteType: NoteType.STR };


describe('Key Test Suite', () => {
	describe('memoize', () => {
		it('should be the same scale', () => {
			const key = new Key('C', Scale.MAJOR, TEST);

			expect(key.scale).to.equal(key.scale);
		});
	});

	describe('Modes', () => {
		it('should have chords for C Major', () => {
			const key = new Key('C', Scale.MAJOR, TEST);

			expect(key.modes).to.eql([
				'CM7',
				'Dm7',
				'Em7',
				'FM7',
				'G7',
				'Am7',
				'Bm7b5',
			]);
		});

		it('should have chords for Ab Minor', () => {
			const key = new Key('Ab', Scale.MINOR, TEST);

			expect(key.modes).to.eql([
				'Abm7',
				'Bbm7b5',
				'BM7',
				'Dbm7',
				'Ebm7',
				'EM7',
				'Gb7',
			]);
		});

		it('should have chords for E Dorian', () => {
			const key = new Key('E', Scale.DORIAN, TEST);

			expect(key.modes).to.eql([
				'Em7',
				'F#m7',
				'GM7',
				'A7',
				'Bm7',
				'C#m7b5',
				'DM7',
			]);
		});

		it('should allow accessing a mode through Proxy', () => {
			const key = new Key('E', Scale.MAJOR, TEST);

			const eMyxo = key.MIXOLYDIAN;

			expect(eMyxo.chord.name).to.eql('B7');
			expect(eMyxo.notes).to.eql([ 'B', 'C#', 'D#', 'E', 'F#', 'G#', 'A' ]);
		});
	});

	describe('#modulate', () => {
		it('should modulate UP', () => {
			const key = new Key('C', Scale.MAJOR, TEST);

			key.modulate(Key.MOD_UP);

			expect(key.notes).to.eql([ 'G', 'A', 'B', 'C', 'D', 'E', 'F#' ]);
		});

		it('should modulate DOWN', () => {
			const key = new Key('A', Scale.MAJOR, TEST);

			key.modulate(Key.MOD_DOWN);

			expect(key.notes).to.eql([ 'D', 'E', 'F#', 'G', 'A', 'B', 'C#' ]);
		});
	});
});
