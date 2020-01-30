/**
 * Constants
 */
declare namespace Constants {
    /**
     * Notes
     */
    namespace Note {
        /**
         * Notes with sharps
         */
        const SHARPS: String[];

        /**
         * Notes with flats
         */
        const FLATS: String[];

        /**
         * Enharmonic pairs
         */
        const ENHARMONICS: String[];

        /**
         * Diatonic notes
         */
        const DIATONIC_NOTES: String[];

    }

    /**
     * Scales
     */
    namespace Scales {
        /**
         * Chromatic scale
         */
        const CHROMATIC_SCALE: string;

        /**
         * List of available scales
         */
        const SCALES: Map<String, String>;

    }

    /**
     * Turn
     */
    namespace TurnMoves {
        /**
         * The start of a turn
         */
        var TURN_START: String;

        /**
         * Modulate up in key
         */
        var TURN_UP: String;

        /**
         * Modulate down in key
         */
        var TURN_DOWN: String;

        /**
         * Stay in key during this turn
         */
        var TURN_KEEP: String;

        /**
         * Modulate down to another key
         */
        var TURN_MOD_DOWN: String;

        /**
         * Modulate up to another key
         */
        var TURN_MOD_UP: String;

        /**
         * Randomly picks any of the other turn movements
         */
        var TURN_FREE: String;

    }

}

/**
 * Core
 */
declare namespace Core {
    class Chord {
        /**
         * Chord
         */
        constructor();

        /**
         * Creates an instance of Chord.
         * @param chord - a chord name f.ex: 'Am7'
         * @param chord.root - f.ex: A
         * @param chord.scale - f.ex: Scale.DORIAN
         * @param chord.structure - f.ex: Chord.SIXTH
         * @param opts - chord options
         * @param opts.noteType - the note type in the chord
         * @param opts.octaves [starting, number of octaves] range of octaves to map notes to
         */
        constructor(chord?: undefined_chord, opts?: undefined_opts);

        /**
         * Returns the chord's name
         */
        name: String;

        /**
         * Is the note a flat
         */
        hasFlats(): Boolean;

        /**
         * Is the note a flat
         */
        hasSharps(): Boolean;

        /**
         * Sets the octaves and assigns them to the notes
         * @param octaves
         */
        octaves: Number[];

        /**
         * Assigns a new octave range - [ 4, 1 ]
         * @param octaves
         */
        assignOctaves(octaves: Number[]): void;

        /**
         * Finds the most suitable chord name for this chord
         * @param chord
         */
        static findChordName(chord: any): String;

    }

    class HarmonyBase {
        /**
         * The base class for harmonic structures
         */
        constructor();

        /**
         * Creates an instance of HarmonyBase.
         * @param root
         * @param type
         * @param noteType
         */
        constructor(root: Note, type: String, noteType: NoteType);

        /**
         * Gets the root note
         */
        root: String;

        /**
         * Gets the notes
         */
        notes: Note[];

        /**
         * Gets the type
         */
        type: String;

    }

    class Key {
        /**
         * Defines a key
         */
        constructor();

        /**
         * Creates an instance of Key.
         * @param root
         * @param type the type of Scale to create
         * @param opts
         * @param opts.noteType the note's value type
         */
        constructor(root: String | Note, type: String, opts?: undefined_opts);

        /**
         * Gets the modes of the current key
         */
        modes(): Mode[];

        /**
         * Modulate key based on a direction & interval
         * @param direction
         * @param interval
         */
        modulate(direction: Symbol, interval?: String): void;

        /**
         * Modulate key within it's relative modes based on a direction & interval
         * @param opts
         * @param opts.direction
         * @param opts.interval
         */
        modulateMode(opts?: modulateMode_opts): void;

        /**
         * Get the mode position in Roman Numerals
         * @param inRomanNumber
         */
        modePosition(inRomanNumber?: Boolean): Number | String;

        /**
         * Chord belonging to this mode
         * @param structure
         */
        chord: any;

        /**
         * Checks if the key is a mode
         * @param mode
         */
        static isMode(mode: String): Boolean;

    }

    class Mode {
        /**
         * Defines a Mode
         */
        constructor();

        /**
         * Creates an instance of Mode.
         * @param root - Mode's root
         * @param type - The Mode's type
         * @param opts
         * @param opts.noteType the note's value type
         */
        constructor(root: String | Note, type: String, opts?: undefined_opts);

        /**
         * Chord belonging to this mode
         */
        chord: any;

        /**
         * Scale belonging to this mode
         */
        notes: any;

    }

    class Note {
        /**
         * Defines a note
         */
        constructor();

        /**
         * Creates an instance of Note.
         * @param note - a note
         * @param midi - a midi value
         */
        constructor(note: String, midi: Number);

        /**
         * Returns the note with octave
         */
        n: String;

        /**
         * Returns the note without octave
         */
        note: String;

        /**
         * Returns the enharmonic
         */
        e: String;

        /**
         * Returns the enharmonic
         */
        enharmonic: String;

        /**
         * Returns the enharmonic with oct
         */
        eoct: String;

        /**
         * Returns the midi number
         */
        m: Number;

        /**
         * Returns the midi number
         */
        m: Number;

        /**
         * Returns the note frequency
         */
        f: Number;

        /**
         * Returns the note frequency
         */
        freq: Number;

        /**
         * Returns the distance to C as index
         */
        distC: any;

        /**
         * Returns the next note a semitone away
         */
        next: any;

        /**
         * Returns the previous note a semitone away
         */
        prev: any;

        /**
         * Is the note a flat
         */
        isFlat: any;

        /**
         * Is it a natural note
         */
        isNatural: any;

        /**
         * Is the note a sharp
         */
        isSharp: any;

    }

    class Scale {
        /**
         * Defines a Scale
         */
        constructor();

        /**
         * Creates an instance of Scale.
         * @param note A note
         * @param type the type of scale to create
         * @param opts
         * @param opts.noteType the note's value type
         * @param opts.octaves [starting, number of octaves] range of octaves to map notes to
         */
        constructor(note: Note | String, type: String, opts?: undefined_opts);

        /**
         * Is the note a flat
         */
        hasFlats(): Boolean;

        /**
         * Is the note a flat
         */
        hasSharps(): Boolean;

        /**
         * Sets the octaves and assigns them to the notes
         * @param octaves
         */
        octaves: Number[];

        /**
         * Assigns a new octave range - [ 4, 1 ]
         * @param octaves
         */
        assignOctaves(octaves: Number[]): void;

    }

}

declare interface undefined_chord {
    /**
     * f.ex: A
     */
    root: Object;
    /**
     * f.ex: Scale.DORIAN
     */
    scale: Object;
    /**
     * f.ex: Chord.SIXTH
     */
    structure: Object;
}

declare interface undefined_opts {
    /**
     * the note's value type
     */
    noteType: String;
    /**
     * [starting, number of octaves] range of octaves to map notes to
     */
    octaves: Number[];
}

declare interface modulateMode_opts {
    direction: Symbol;
    interval: Number;
}

/**
 * Namepsace for all Types
 */
declare namespace Types {
    /**
     * Drums Type
     */
    interface Drums {
        /**
         * combination of hits and rests
         */
        pattern: String[];
        /**
         * in note value
         */
        subdivision: String;
    }

    /**
     * Melody Type
     */
    interface Melody {
        /**
         * duration in ticks
         */
        dur: Number;
        /**
         * midi note
         */
        midi: Number;
        /**
         * note as string
         */
        note: String;
        /**
         * transport time in ticks
         */
        time: Number;
    }

}

declare class NoteType {
    constructor();

    static NOTE: NoteType.NOTE;

    static MIDI: NoteType.MIDI;

    static FREQ: NoteType.FREQ;

    static STR: NoteType.STR;

}

/**
 * Functional
 */
declare namespace Functional {
    /**
     * Creates a chord progression
     * @param timeline
     * @param opts
     * @param opts.structures
     */
    function createChordProgression(timeline: Object[], opts?: createChordProgression_opts): Object[];

    /**
     * Create a chord
     * @param key
     * @param type chord type
     * @param octaves
     */
    function createChord(key: String, type: String, octaves: Number[]): Object;

    /**
     * Creates a mixture of euclidean rhythm patterns
     * @param steps [ 32, 16, 8, 4 ]
     * @param maxBeatsPerPart Max numbers of beats per part
     * @param randomBeats Have random beats
     */
    function drums(steps: Number, maxBeatsPerPart: Number, randomBeats: Boolean): Drums;

    /**
     * Create interleaved motifs
     * @param timeline
     * @param motifTypes
     * @param restProb
     */
    function createMelodies(timeline: Object[], motifTypes: Object[], restProb: Number): Melody[];

    /**
     * Generates a motif
     * @param notes
     * @param rhythm decides which duration to be used based on probabilities
     * @param startTime when to start the motif
     * @param noDurMapping leave time per event = startTime
     * @param mapToTicks map duration to ticks
     */
    function createMotif(notes: Note[], rhythm: String[], startTime: Number, noDurMapping: Boolean, mapToTicks: Boolean): Motif[];

    /**
     * Creates a Movement
     * @param key starting scale
     * @param length in Transport time
     * @param opts
     * @param opts.timeSignatures [[4, 4], [3, 4]]
     * @param opts.turns turns
     * @param opts.modProb modulation probability
     * @param opts.repeats repeat inner movement parts
     */
    function createMovement(key: Key, length: Number, opts?: createMovement_opts): Object[];

    /**
     * Creates a Movement out of a Turn structure
     * @param key starting scale
     * @param turns in Transport time
     * @param length in Transport time
     * @param opts
     * @param opts.timeSignatures [[4, 4], [3, 4]]
     * @param opts.turns turns
     * @param opts.repeats repeat inner movement parts
     */
    function createTurnMovement(key: Key, turns: String[], length: Number, opts?: createTurnMovement_opts): Turn[];

    /**
     * Create scale
     * @param key
     * @param type scale type
     * @param octaves
     */
    function createScale(key: String, type: String, octaves: Number[]): Object;

}

declare interface createChordProgression_opts {
    structures: Object;
}

declare interface Motif {
    /**
     * when it's playing in Ticks
     */
    time: String;
    /**
     * in note value
     */
    dur: String;
    /**
     * the note
     */
    note: String;
    /**
     * midi value
     */
    midi: Number;
}

declare interface createMovement_opts {
    /**
     * [[4, 4], [3, 4]]
     */
    timeSignatures: (Number[])[];
    /**
     * turns
     */
    turns: Number;
    /**
     * modulation probability
     */
    modProb: Object;
    /**
     * repeat inner movement parts
     */
    repeats: Object;
}

declare interface Turn {
    /**
     * '▼'
     */
    type: String;
    /**
     * '⟷'
     */
    interval: String | Number;
}

declare interface createTurnMovement_opts {
    /**
     * [[4, 4], [3, 4]]
     */
    timeSignatures: (Number[])[];
    /**
     * turns
     */
    turns: Number;
    /**
     * repeat inner movement parts
     */
    repeats: Object;
}

declare interface Movement {
    /**
     * when it's playing in Ticks
     */
    time: String;
    /**
     * in note value
     */
    dur: String;
    /**
     * the note
     */
    note: String;
    /**
     * midi value
     */
    midi: Number;
}

/**
 * The Toolshed
 */
declare namespace Tools {
    /**
     * Choose a random element from an array
     * @param list
     * @param seed
     */
    function choose(list: any[], seed: String | Number): any;

    /**
     * Note distance functions
     */
    namespace Distance {
        /**
         * Position in the chromatic scale from C
         * @param note
         */
        function position(note: Note): Number | null;

        /**
         * Distance of 2 notes in semitones
         * @param a
         * @param b
         */
        function semitones(a: Note, b: Note): Number | null;

        /**
         * Get the interval between 2 notes
         * @param a
         * @param b
         */
        function interval(a: Note, b: Note): String | null;

        /**
         * Transpose a note by an interval
         * @param note
         * @param int interval
         */
        function transposeUp(note: Note, int: String): Number | null;

        /**
         * Transpose a note by an interval
         * @param note
         * @param int interval
         */
        function transposeDown(note: Note, int: String): Number | null;

    }

    /**
     * Distribute tools
     */
    namespace Distribute {
        /**
         * Sum probabilities together
         * @param probabilities
         * @param precision
         */
        function sumDistribution(probabilities: Number[], precision?: Number): String[];

        /**
         * Creates a descending probability distribution
         * @param k
         * @param precision
         */
        function descending(k: Number | Number[], precision: Number): String[];

        /**
         * Creates an equal probability distribution
         * @param k
         * @param precision
         */
        function equal(k: Number | Number[], precision: Number): String[];

    }

    /**
     * Euclidean Rhythm tool
     */
    namespace Euclidean {
        /**
         * Create an Euclidean rhythm based on Bresenham's line algorithm
         * @param pulses larger number
         * @param beats smaller number
         */
        function create(pulses: Number, beats: Number): any[];

        /**
         * Rotates an euclidean pattern
         * @param pattern
         */
        function rotate(pattern: any[]): any[];

    }

    /**
     * Approaches:
     * * Based on a list of notes, find possible compatible keys.
     * * The comparison is done between matching intervals. Categorized by the most notes in common to the least.
     * @param notes
     * @param rankedScales
     */
    function friendly(notes: String[], rankedScales?: String[]): Object[];

    /**
     * Intervals
     */
    namespace Interval {
        /**
         * Gets one or several intervals from a number of semitones
         * @param semitones
         */
        function interval(semitones: Number): String[] | null;

        /**
         * Gets the semitones of an interval
         * @param interv
         */
        function semitones(interv: String): Number | null;

        /**
         * Inverts the given interval
         * @param interv
         */
        function invert(interv: String): String | null;

        /**
         * Adds two intervals together
         * @param a
         * @param b
         */
        function add(a: String, b: String): Number | null;

        /**
         * Subtracts two intervals together
         * @param a
         * @param b
         */
        function subtract(a: String, b: String): Number | null;

    }

    /**
     * MIDI tools
     */
    namespace Midi {
        /**
         * Find the nearest MIDI note
         * @param base
         * @param note
         */
        function findNearest(base: Number, note: String): Number;

        /**
         * Find the nearest chord
         * @param baseChord
         * @param chord
         * @param hasFlats
         */
        function findNearest(baseChord: Number[], chord: String[], hasFlats: Boolean): Number[];

    }

    /**
     * Random Tools
     */
    namespace Random {
        /**
         * Seed the Simplex Noise
         * @param seed
         * @param increment
         */
        function seedRandom(seed: String | Number, increment: Number): void;

        /**
         * Create a random number generator based on a seed
         * Simplex noise
         * @param s
         */
        function random(s: String | Number): Number;

        /**
         * Generates a random integer between a range
         * @param max
         * @param min
         */
        function randomInt(max: Number, min?: Number): Number;

    }

    /**
     * Works with @distribute
     * @param elements
     * @param probabilities
     */
    function roll(elements: any[], probabilities: Number[]): Object | Null;

    /**
     * Rotates an array N number of times
     * @param list
     * @param nrOfTimes
     */
    function rotate(list: any[], nrOfTimes?: number): any[];

    /**
     * Shuffles an array N number of times
     * @param list
     * @param nrOfTimes
     */
    function shuffle(list: any[], nrOfTimes?: number): any[];

    /**
     * Time tools
     */
    namespace Time {
        /**
         * BARS : QUARTERS : BEATS
         * @param time '2.3.1'
         * @param positionMode
         */
        function transportToTicks(time: String, positionMode?: boolean): Number[];

        /**
         * Converts ticks to transport notation
         * @param ticks
         * @param opts
         * @param opts.timeSignature
         * @param opts.positionMode
         */
        function ticksToTransport(ticks: Number, opts?: ticksToTransport_opts): String;

        /**
         * Creates a timeline by assigning the duration to each event's time
         * @param pattern
         * @param mapToTicks
         */
        function mapDurations(pattern: Object[], mapToTicks: Boolean): Object[];

    }

}

/**
 * Create turn based rhythms
 * @param length in ticks or transport
 * @param turns number of turns
 * @param opts available options
 * @param opts.minNoteValue available options
 * @param opts.combSorting algorithms: [diverseFirst, similarFirst, favorNumber]
 * @param opts.debug toggle debug mode
 */
declare function createTurnRhythm(length: Number, turns: Number, opts?: createTurnRhythm_opts): Object[];

declare interface createTurnRhythm_opts {
    /**
     * available options
     */
    minNoteValue: Number;
    /**
     * algorithms: [diverseFirst, similarFirst, favorNumber]
     */
    combSorting: Object;
    /**
     * toggle debug mode
     */
    debug: Boolean;
}

declare interface ticksToTransport_opts {
    timeSignature: Number[];
    positionMode: Boolean;
}

/**
 * Generic Utilities
 */
declare namespace Utils {
    /**
     * Deconstruct Chord from a String into a Object
     * @param chordName
     */
    function deconstructName(chordName: String): Object;

    /**
     * Backtracking algorithm for finding all possible combination for a specific sum.
     * @param target
     * @param maxOnes
     */
    function combinationSum(target: Number, maxOnes: Number): String[];

    class PlayaError {
        /**
         * Custom Error
         */
        constructor();

        /**
         * Creates an instance of PlayaError.
         * @param name
         * @param message
         * @param Object { error, ...context }
         */
        constructor(name: String, message?: String, Object: Object);

    }

    /**
     * Maps an array of notes into a specified type
     * @param notes
     * @param type
     */
    function mapNotes(notes: Note[], type: NoteType): NoteType[];

    /**
     * Maps an array of modes into a specified type
     * @param modes
     * @param elemType
     */
    function mapModes(modes: Mode[], elemType: String): (Scale | Chord)[];

    /**
     * Returns a note's accidental [# | b]
     * @param note
     */
    function whichAccident(note: String): String;

    /**
     * Returns a note without the accidental
     * @param note
     */
    function natural(note: String | Note): String;

    /**
     * Strips the octave from the note
     * @param note
     */
    function stripOctave(note: String): String;

    /**
     * Assign octaves to the notes passed
     * @param notes
     * @param octaves which octaves to map to
     * @param type which type of the notes array is it
     */
    function assignOctaves(notes: (Scale | Chord)[], octaves: Number[], type: 'scale' | 'chord'): Note[];

    /**
     * Loops till the condition seizes to be true
     * @param fn
     * @param condition
     * @param maxLoops
     */
    function whilst(fn: Function, condition: Function, maxLoops?: Object.Number): void;

}

/**
 * 
 * @param candidates - candidate numbers we're picking from.
 * @param remainingSum - remaining sum after adding candidates to currentCombination.
 * @param finalCombinations - resulting list of combinations.
 * @param currentCombination - currently explored candidates.
 * @param startFrom - index of the candidate to start further exploration from.
 */
declare function combinationSumRecursive(candidates: Number[], remainingSum: Number, finalCombinations: (Number[])[], currentCombination: Number[], startFrom: Number): (Number[])[];

