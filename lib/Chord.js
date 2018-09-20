const Note = require('./Note');
const Scale = require('./Scale');
const getInterval = require('./Interval');
const CHORDS = require('./chords');


class Chord {
  constructor(chordName) {
    const separators = {
      root: /(?:[A-G](#|b)?){0,2}/, // NOTE
      quality: /M|m|aug|dim|5|sus2|sus4/, // QUALITY
      extensions: /.*/
    };

    this._chordName = chordName;
    this._root = this._quality = null;
    this._extensions = [];

    let chord = chordName;

    for (const sep in separators) {
      const reg = new RegExp(separators[sep]);

      let result = chord.match(reg);

      if (!result && sep === 'quality') {
        result = ['M']; // ASSUME IT'S MAJOR
      } else if (!result) {
        continue;
      }

      chord = chord.replace(reg, '');

      if (sep === 'extensions') {
        this._extensions = this._extensions.concat(result);
      } else {
        this['_' + sep] = result[0];

      }
    }

    if (this._root && this._quality) {
      this._notes = this._createChord(chordName);
    }
  }

  /**
   * Returns the notes of the chord
   *
   * @readonly
   */
  get n() {
    return this._notes;
  }

  /**
   * Returns the root note of the chord
   *
   * @readonly
   */
  get r() {
    return this._root;
  }

  /**
   * Returns the chord's quality
   *
   * @readonly
   */
  get q() {
    return this._quality;
  }

  /**
   * Returns the chord's extensions
   *
   * @readonly
   */
  get ext() {
    return this._extensions;
  }

  /**
 * Returns the chord's name
 *
 * @readonly
 */
  get name() {
    return this._chordName;
  }

  _createChord(chordName) {
    const root = this._root;
    const chromaticScale = new Scale(root, Scale.CHROMATIC).nStr;
    const chromaLen = chromaticScale.length;
    const notes = [];

    const chordType = chordName.replace(root, '');

    let chord = CHORDS[chordType][0];
    const intervals = chord.split(' ');

    for (let idx = 0; idx < intervals.length; idx++) {
      const interval = intervals[idx];
      let intervalValue = getInterval(interval);

      if (intervalValue > chromaLen - 1) {
        intervalValue -= chromaLen;
      }

      const note = chromaticScale[intervalValue];

      if (note) {
        notes.push(note);
      }
    }

    return notes;
  }
}

module.exports = Chord;