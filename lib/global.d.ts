declare module '@ricardomatias/roll' {
	namespace distribute {
		function sumDistribution(distribution: string[], precision: number): string[];
		function equal<T>(distribution: T | T[], precision?: number): string[];
		function decreasing<T>(distribution: T | T[], precision?: number): string[];
	}
	function roll<T>(elements: T[], probabilities: string[], rng: CallableFunction): T;
}

declare module 'roman-numeral' {
	function convert(num: number): string;
}


