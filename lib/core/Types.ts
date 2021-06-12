import { ChordDefinition, ChordIntervals, NoteSymbol } from '../constants';

export interface ChordEvent {
	chord: number[];
	dur: number;
	chordName: string;
	time: number;
}

export type CoreClassType = 'scale' | 'chord' | 'key';

export type ChordDescriptor = { root: NoteSymbol; intervals: ChordIntervals | string } & Partial<
	Pick<ChordDefinition, 'name' | 'symbol' | 'structure'>
>;
