const Scale = require('../lib/scale');

const scale = new Scale();

describe('Scale Test Suite', t => {

  describe('#_organizeNotes', () => {

    it('should organize notes - natural', () => {
      const notes = scale._organizeNotes('D');

      expect(notes).to.eql(['D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#']);
    });

    it('should organize notes - sharp', () => {
      const notes = scale._organizeNotes('F#');

      expect(notes).to.eql(['F#', 'G', 'G#', 'A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F']);
    });

    it('should organize notes - flat', () => {
      const notes = scale._organizeNotes('Bb');

      expect(notes).to.eql(['Bb', 'B', 'C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A']);
    });
  });

  describe('#createScale', () => {

    it('should create scale - natural', () => {
      const notes = scale.createScale('C', scale.MAJOR);

      expect(notes).to.eql(['C', 'D', 'E', 'F', 'G', 'A', 'B']);
    });

    it('should create scale - sharp', () => {
      const notes = scale.createScale('G#', 'minor');

      expect(notes).to.eql(['G#', 'A#', 'B', 'C#', 'D#', 'E', 'F#']);
    });

    it('should create scale - flat', () => {
      const notes = scale.createScale('Db', 'lydian');

      expect(notes).to.eql([ 'Db', 'Eb', 'F', 'G', 'Ab', 'Bb', 'C' ]);
    });
  });

  describe('#mapScaleOctaves', () => {

    it('should create scale - natural', () => {
      const notes = scale.createScale('C', scale.MAJOR);
      const octaves = scale.mapScaleOctaves(notes);

      expect(octaves[0]).to.eql('C0');
      expect(octaves[30]).to.eql('E5');
      expect(octaves[octaves.length - 1]).to.eql('B9');
    });

    it('should create scale - sharp', () => {
      const notes = scale.createScale('E', scale.MAJOR);
      const octaves = scale.mapScaleOctaves(notes);

      expect(octaves[0]).to.eql('E0');
      expect(octaves[30]).to.eql('G#5');
      expect(octaves[octaves.length - 1]).to.eql('D#9');
    });

    it('should create scale - flat', () => {
      const notes = scale.createScale('Ab', scale.MAJOR);
      const octaves = scale.mapScaleOctaves(notes);

      expect(octaves[0]).to.eql('Ab0');
      expect(octaves[30]).to.eql('C5');
      expect(octaves[octaves.length - 1]).to.eql('G9');
    });
  });

  describe('#modulate', () => {
    
    it('should modulate UP', () => {
      const notes = scale.createScale('C', scale.MAJOR);
      const newScale = scale.modulate(notes, scale.MAJOR, scale.UP);

      expect(newScale).to.eql(['G', 'A', 'B', 'C', 'D', 'E', 'F#']);
    })

    it('should modulate DOWN', () => {
      const notes = scale.createScale('A', scale.MAJOR);
      const newScale = scale.modulate(notes, scale.MAJOR, scale.DOWN);

      expect(newScale).to.eql(['D', 'E', 'F#', 'G', 'A', 'B', 'C#']);
    })
  });
});
