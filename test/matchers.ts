/* eslint-disable @typescript-eslint/no-namespace */

import * as R from 'ramda';
import { diff } from 'jest-diff';
import { printExpected, printReceived, matcherHint } from 'jest-matcher-utils';
import { NoteSymbol, ScaleIntervals } from '../lib/constants';
import { Note } from '../lib/core';
// import { expect, jest, test } from '@jest/globals';
import { expect } from 'vitest';

type KeyMatch = { root: NoteSymbol; scale: ScaleIntervals };

declare global {
	namespace jest {
		interface Matchers<R> {
			toHaveMidiNotes: (midi: number[]) => CustomMatcherResult;
			toHaveStringNotes: (notes: string[]) => CustomMatcherResult;
			toLastAround: (totalDuration: number) => CustomMatcherResult;
			toHaveMatch: <T>(match: Partial<T>) => CustomMatcherResult;
			toHaveKeyMatch: (match: KeyMatch) => CustomMatcherResult;
		}
	}
}

expect.extend({
	toHaveMidiNotes(received, midi: number) {
		const pass = this.equals(received.midi, midi);
		return {
			message: () => `expected ${received.midi} to include ${midi}`,
			pass,
		};
	},
	toHaveStringNotes(received, str: string) {
		const pass = this.equals(received.pitches, str);
		return {
			message: () => '\n\n' + `Expected: ${printExpected(received.pitches)}\n` + `Received: ${printReceived(str)}`,
			pass,
		};
	},
	toLastAround(received, totalDuration: number) {
		if (!Array.isArray(received)) {
			return {
				message: () => `expected ${received} must be an Array`,
				pass: false,
			};
		}

		if (!received.length) {
			return {
				message: () => `expected ${received} not to be empty`,
				pass: false,
			};
		}

		const lastEvent = received[received.length - 1];
		let pass = false;

		if (lastEvent.time === totalDuration) pass = true;
		if (lastEvent.time < totalDuration && lastEvent.next >= totalDuration) pass = true;

		return {
			message: () => `expected to have a duration around ${totalDuration} but got ${lastEvent.next}`,
			pass,
		};
	},
	toHaveMatch<T>(received: T[], match: Partial<T>) {
		if (!Array.isArray(received)) {
			return {
				message: () => `expected ${received} must be an Array`,
				pass: false,
			};
		}

		const pass = R.any(R.whereEq(match), received);

		const diffString = diff(match, received);

		return {
			message: () =>
				!pass
					? '\n\n' +
					  matcherHint('toHaveMatch', undefined, undefined) +
					  `\nDifference:\n\n${diffString}\n\n` +
					  `Expected: ${printExpected(match)}\n` +
					  `Received: ${printReceived(received)}`
					: '',
			pass,
		};
	},
	toHaveKeyMatch(received: KeyMatch[], match: KeyMatch) {
		if (!Array.isArray(received)) {
			return {
				message: () => `expected ${received} must be an Array`,
				pass: false,
			};
		}

		const root = new Note(match.root);

		let pass = R.any(R.whereEq(match), received);

		if (!root.isNatural) {
			pass = pass || R.any(R.whereEq({ root: root.enharmonic, scale: match.scale }), received);
		}

		const diffString = diff(match, received);

		return {
			message: () =>
				!pass
					? '\n\n' +
					  matcherHint('toHaveMatch', undefined, undefined) +
					  `\nDifference:\n\n${diffString}\n\n` +
					  `Expected: ${printExpected(match)}\n` +
					  `Received: ${printReceived(received)}`
					: '',
			pass,
		};
	},
});
