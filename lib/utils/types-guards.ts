export function isDefined<T>(argument: T | undefined): argument is T {
	return argument !== undefined;
}

export function isNull<T>(argument: T | null): argument is null {
	return argument === null;
}

export function isNotNull<T>(argument: T | null): argument is T {
	return argument !== null;
}

export function isUndefined<T>(argument: T | undefined): argument is undefined {
	return argument === undefined;
}

export function isString(argument: unknown): argument is string {
	return typeof argument === 'string';
}

export function isNumber(argument: unknown): argument is number {
	return typeof argument === 'number';
}

export function isArray<T>(argument: T | T[]): argument is Array<T> {
	return Array.isArray(argument);
}

export function hasKeyValue<T>(item: T | Required<T>, key: keyof T): item is Required<T> {
	return item[key] !== undefined;
}

export type Pull<T, K extends keyof T> = T[K]
