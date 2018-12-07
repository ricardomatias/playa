import { Key, Chord } from '../../lib/core';
import NoteType from '../../lib/core/types';
import { seedRandom } from '../../lib/tools';

const TEST = { noteType: NoteType.STR };


function modesToChords(modes) {
	return modes.map((mode) => {
		const chord = new Chord({
			root: mode.root,
			type: mode.scale,
			structure: Chord.SEVENTH,
		}, TEST);

		return chord.name;
	});
}

function modesToScales(modes) {
	return modes.map((mode) => {
		return Key.NAMES[mode.scale];
	});
}


describe('Key Test Suite', () => {
	describe('memoize', () => {
		it('should be the same scale', () => {
			const key = new Key('C', Key.MAJOR, TEST);

			expect(key.scale).to.equal(key.scale);
		});
	});

	describe('Modes', () => {
		it('should have chords for C Major', () => {
			const key = new Key('C', Key.MAJOR, TEST);

			expect(modesToChords(key.modes)).to.eql([
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
			const key = new Key('Ab', Key.MINOR, TEST);

			expect(modesToChords(key.modes)).to.eql([
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
			const key = new Key('E', Key.DORIAN, TEST);

			expect(modesToChords(key.modes)).to.eql([
				'Em7',
				'F#m7',
				'GM7',
				'A7',
				'Bm7',
				'C#m7b5',
				'DM7',
			]);
		});

		it('should allow accessing a mode through Proxy - E MIXOLYDIAN', () => {
			const key = new Key('E', Key.MAJOR, TEST);

			const eMyxo = key.MIXOLYDIAN;

			expect(eMyxo.chord.name).to.eql('B7');
			expect(eMyxo.notes).to.eql([ 'B', 'C#', 'D#', 'E', 'F#', 'G#', 'A' ]);
		});

		it('should allow accessing a mode through Proxy - E LYDIAN', () => {
			const key = new Key('E', Key.MAJOR, TEST);

			const eLyd = key.LYDIAN;

			expect(eLyd.chord.name).to.eql('AM7');
			expect(eLyd.notes).to.eql([ 'A', 'B', 'C#', 'D#', 'E', 'F#', 'G#' ]);
		});
	});

	describe('#modulate', () => {
		it('should modulate UP', () => {
			const key = new Key('C', Key.MAJOR, TEST);

			key.modulate(Key.MOD_UP);

			expect(key.notes).to.eql([ 'G', 'A', 'B', 'C', 'D', 'E', 'F#' ]);
		});

		it('should modulate DOWN', () => {
			const key = new Key('A', Key.MAJOR, TEST);

			key.modulate(Key.MOD_DOWN);

			expect(key.notes).to.eql([ 'D', 'E', 'F#', 'G', 'A', 'B', 'C#' ]);
		});

		it('should modulate DORIAN', () => {
			const key = new Key('E', Key.DORIAN, TEST);

			key.modulate(Key.MOD_DOWN, '2M');

			expect(key.notes).to.eql([ 'D', 'E', 'F', 'G', 'A', 'B', 'C' ]);
		});

		it('should modulate PHRYGIAN', () => {
			const key = new Key('G', Key.PHRYGIAN, TEST);

			key.modulate(Key.MOD_UP, '6M');

			expect(key.notes).to.eql([ 'E', 'F', 'G', 'A', 'B', 'C', 'D' ]);
		});
	});

	describe('#modulateMode', () => {
		const key = new Key('Eb', Key.MIXOLYDIAN, TEST);

		seedRandom('test');

		it('should have key', () => {
			expect(key.root).to.eql('Eb');
			expect(Key.NAMES[key.type]).to.eql('MIXOLYDIAN');
			expect(key.chord.name).to.eql('Eb7');

			expect(modesToChords(key.modes)).to.eql([
				'Eb7', 'Fm7', 'Gm7b5', 'AbM7', 'Bbm7', 'Cm7', 'DbM7',
			]);

			expect(modesToScales(key.modes)).to.eql([
				'MIXOLYDIAN',
				'AEOLIAN',
				'LOCRIAN',
				'IONIAN',
				'DORIAN',
				'PHRYGIAN',
				'LYDIAN',
			]);
		});

		it('should modulate to another mode - IONIAN', () => {
			key.modulateMode();

			expect(key.root).to.eql('Ab');
			expect(Key.NAMES[key.type]).to.eql('IONIAN');
			expect(key.chord.name).to.eql('AbM7');
			expect(key.notes).to.eql([ 'Ab', 'Bb', 'C', 'Db', 'Eb', 'F', 'G' ]);
		});

		it('should modulate to another mode', () => {
			key.modulateMode();

			expect(key.root).to.eql('F');
			expect(Key.NAMES[key.type]).to.eql('AEOLIAN');
			expect(key.chord.name).to.eql('Fm7');
			expect(key.notes).to.eql([ 'F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb' ]);
		});
	});
});
