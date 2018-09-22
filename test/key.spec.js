import Key from '../lib/Key';
import Scale from '../lib/Scale';

const modesToString = modes => {
  return modes.map(mode => {
    const chord = mode.chord;

    return chord.name;
  });
};

describe('Key Test Suite', () => {
  describe('Modes', () => {
    it('should have chords for C Major', () => {
      const key = new Key('C', Scale.MAJOR);

      expect(modesToString(key.modes)).to.eql([
        'CM7',
        'Dm7',
        'Em7',
        'FM7',
        'G7',
        'Am7',
        'Bm7b5'
      ]);
    });

    it('should have chords for Ab Minor', () => {
      const key = new Key('Ab', Scale.MINOR);

      expect(modesToString(key.modes)).to.eql([
        'Abm7',
        'Bbm7b5',
        'BM7',
        'Dbm7',
        'Ebm7',
        'EM7',
        'Gb7'
      ]);
    });

    it('should have chords for E Dorian', () => {
      const key = new Key('E', Scale.DORIAN);

      expect(modesToString(key.modes)).to.eql([
        'Em7',
        'F#m7',
        'GM7',
        'A7',
        'Bm7',
        'C#m7b5',
        'DM7'
      ]);
    });
  });

  describe('#modulate', () => {
    it('should modulate UP', () => {
      const key = new Key('C', Scale.MAJOR);

      key.modulate(key.MOD_UP);

      expect(key.scale.notesStr).to.eql(['G', 'A', 'B', 'C', 'D', 'E', 'F#']);
    });

    it('should modulate DOWN', () => {
      const key = new Key('A', Scale.MAJOR);

      key.modulate(key.MOD_DOWN);

      expect(key.scale.notesStr).to.eql(['D', 'E', 'F#', 'G', 'A', 'B', 'C#']);
    });
  });
});
