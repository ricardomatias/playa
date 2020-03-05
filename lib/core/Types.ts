export interface NoteEvent {
	dur: number;
	midi: number;
	note: string;
	time: number;
}

export interface ChordEvent {
	chord: number[];
	dur: number;
	chordName: string;
	time: number;
}

