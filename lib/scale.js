/* exported Scale */
const SHARPS = [
  'A', 'A#', 'B', 'C', 'C#', 'D',
  'D#', 'E', 'F', 'F#', 'G', 'G#'
];

const FLATS = [
  'A', 'Bb', 'B', 'C', 'Db', 'D',
  'Eb', 'E', 'F', 'Gb', 'G', 'Ab'
];

class Scale {
  constructor() {
    this.MAJOR = 'MAJOR';
    this.UP = 'UP';
    this.DOWN = 'DOWN';

    this.intervalMap = {
      P: 5,
      A: 3,
      M: 2,
      m: 1,
    };

    this.sharpKeys = [
      'C', 'G', 'D', 'A', 'E', 'B', 'F#',
      'C#', 'G#', 'D#',
    ];

    // TODO: Add case for handling enharmonics / such as A#
    this.flatkeys = [
      'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb',
      'D', 'G', 'C'
    ];

    this.circleOfFifths = [
      'C', 'G', 'D', 'A', 'E', 'B',
      'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F'
    ];
  }

  // TODO: Figure out for non-major/minor scales
  modulate(notes, scale, direction) {
    let key = notes[4];

    if (direction === this.DOWN) {
      key = notes[3];
    }

    return this.createScale(key, scale);
  }

  getIntervals(scale) {
    var intervals = {
      [this.MAJOR]: 'MMmMMMm',
      minor: 'MmMMmMM',
      dorian: 'MmMMMmM',
      phrygian: 'mMMMmMM',
      lydian: 'MMMmMMm',
      mixolydian: 'MMmMMmM',
      locrian: 'mMMmMMM'
    };

    return intervals[scale];
  }

  _organizeNotes(tonic) {
    var notes = [],
        hasSharps = false,
        chromatic;
    
    for (const note of this.sharpKeys) {
      if (tonic === note) {
        hasSharps = true;
        break;
      }
    }

    notes = hasSharps ? SHARPS : FLATS;

    for (let index = 0; index < notes.length; index++) {
      const note = notes[index];
      
      if (tonic === note) {
        chromatic = notes.slice(index).concat(notes.slice(0, index));
        break;
      }
    }

    return chromatic;
  }

  createScale(tonic, scale, intervals) {
    var availableNotes = this._organizeNotes(tonic),
        notes = [ tonic ],
        baseIndex= 0;
    
    intervals = this.getIntervals(scale) || intervals;

    if (!intervals || typeof intervals !== 'string') {
      console.log('No intervals, no fun, sorry!');
      return [];
    }

    for (let index = 0; index < intervals.length; index++) {
      const interval = intervals[index];
      const intervalValue = this.intervalMap[interval];

      baseIndex = baseIndex + intervalValue;

      if (baseIndex < availableNotes.length) {
        notes[index + 1] = availableNotes[baseIndex];
      }
    }

    return notes;
  }

    // TODO: Adapt this to 127 MIDI notes' scheme
  mapScaleOctaves(notes) {
    const map = [];

    for (let oct = 0; oct < 10; oct++) {
      for (let idx = 0; idx < notes.length; idx++) {
        const note = notes[idx];
        
        map.push(note + oct);
      }
      
      if (oct % 12 === 0) {
        oct++;
      }
    }

    return map;
  }
}

module.exports = Scale;
