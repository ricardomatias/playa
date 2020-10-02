export enum BinaryEvent {
	Rest = 0,
	Hit = 1
}

export type Octaves = [number, number]

export enum RhythmType {
	Free = 'Free',
	Turn = 'Turn'
}

export type DistributionFunction = <T>(distribution: T | T[], precision?: number | undefined) => string[];
