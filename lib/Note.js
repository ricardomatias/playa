const { whichAccident } = require('./utils');

const SHARPS = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
const DIATONIC_NOTES = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

const ENHARMONICS = ['C#|Db', 'D#|Eb', 'F#|Gb', 'G#|Ab', 'A#|Bb'];

const TUNING = 440;

// TODO: Make MIDI, ENHARMONICS and NEIGHBORS lazy loaded
class Note {
  constructor(note, midi) {
    const noteIndex = DIATONIC_NOTES.indexOf(note);

    this._note = noteIndex !== -1 ? DIATONIC_NOTES[noteIndex] : null;

    this._enharmonic = this._octave = this._midi = null;
    this._isFlat = false;
    this._isSharp = false;

    if (midi >= 0 || midi <= 127) {
      this._midi = midi;
    }

    if (typeof this._midi === 'number') {
      this._octave = this._findOctave(midi);

      this._freq = Math.pow(2, (this._midi - 69) / 12) * TUNING
    }

    if (!this._note) {
      this._note = this._resolve(note);
    }

    if (!this._note) {
      return;
    }

    const { next, prev } = this._findNeighbors(this._note);

    this._next = next;
    this._prev = prev;
  }


  /**
   * Returns the note
   *
   * @readonly
   */
  get n() {
    return this._note;
  }

  /**
   * Returns the note with oct
   *
   * @readonly
   */
  get noct() {
    const octave = this._octave;

    if (typeof octave === 'undefined') {
      return null;
    }

    return this._note + octave;
  }


  /**
   * Returns the enharmonic
   *
   * @readonly
   */
  get e() {
    return this._enharmonic;
  }


  /**
   * Returns the enharmonic with oct
   *
   * @readonly
   */
  get eoct() {
    const octave = this._octave;

    if (!octave) {
      return null;
    }
    return this._enharmonic + octave;
  }

  /**
   * Returns the midi number
   *
   * @readonly
   */
  get m() {
    return this._midi;
  }

  /**
   * Returns the note frequency
   *
   * @readonly
   */
  get f() {
    return this._freq;
  }


  /**
   * Returns the next note a semitone away
   *
   * @readonly
   */
  get next() {
    return new Note(this._next);
  }

  /**
   * Returns the previous note a semitone away
   *
   * @readonly
   */
  get prev() {
    return new Note(this._prev);
  }

  /**
   * Is the note a flat
   *
   * @returns {Boolean}
   * @memberof Note
   */
  isFlat() {
    return this._isFlat;
  }

  /**
   * Is the note a sharp
   *
   * @returns {Boolean}
   * @memberof Note
   */
  isSharp() {
    return this._isSharp;
  }

  _findOctave(midi) {
    return Math.floor(11 * (midi / 132)) - 1;
  }

  _resolve(note) {
    this._accident = whichAccident(note);

    if (!this._accident) {
      return null;
    }

    for (let index = 0; index < ENHARMONICS.length; index++) {
      const enharmonic = ENHARMONICS[index];
      const noteIndex = enharmonic.indexOf(note)

      if (noteIndex !== -1) {
        const enharmonicIndex = noteIndex === 0 ? 3 : 0;
        this._enharmonic = enharmonic.substr(enharmonicIndex, 2);
        break;
      }
    }

    if (!this._enharmonic) {
      return null;
    }

    return note;
  }

  _findNeighbors() {
    let note = this._note;

    if (this._accident) {
      if (this._accident === 'b') {
        note = this._enharmonic;

        this._isFlat = true;
      } else {
        this._isSharp = true;
      }
    }

    const noteIndex = SHARPS.indexOf(note);
    // [0, 11]
    // -1 -> 11
    // 12 -> 0
    const prevIndex = noteIndex - 1;
    const nextIndex = noteIndex + 1;

    return {
      prev: SHARPS[prevIndex === -1 ? 11 : prevIndex],
      next: SHARPS[nextIndex === 12 ? 0 : nextIndex]
    }
  }
}

module.exports = Note;
