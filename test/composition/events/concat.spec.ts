import { describe, it, expect } from 'vitest';
import * as R from 'ramda';
import { Events, Rhythm } from '../../../lib/composition';
import { NoteEvent, Time } from '../../../lib/core';
import { mapStartToEvent, random } from '../../../lib/tools';
import '../../matchers';

describe('#concat', () => {
	it('should concat simple', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', Rhythm.Presets.Common);
		const splitRhythm = Events.splitAt(rhythm, '1:0:0');

		// when
		const result = Events.concat(...splitRhythm);

		// then
		expect(result).toLastAround(1920 * 2);
		expect(result).toMatchSnapshot();
	});

	it('should concat 2', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', ['1nt', '2nd']);
		const splitRhythm = Events.splitAt(rhythm, '1:0:0');

		// when
		const result = Events.concat(splitRhythm[0], splitRhythm[1]);

		// then
		expect(result).toLastAround(1920 * 2);
		expect(result).toMatchSnapshot();
	});

	it('should concat 3', () => {
		// given
		random.setSeed('test');

		const rhy1 = Rhythm.free('1:0:0', ['4n', '2n']);
		const rhy2 = Rhythm.free('1:0:0', ['4n', '2n']);
		const rhy3 = Rhythm.free('1:0:0', ['4n', '2n']);

		// when
		const result = Events.concat(rhy1, rhy2, rhy3);

		// then
		expect(result).toLastAround(1920 * 3);
		expect(result).toMatchSnapshot();
	});

	it('should concat late start', () => {
		// given
		random.setSeed('test');

		const rhy1: NoteEvent[] = R.map(mapStartToEvent('2:0:0'), Rhythm.free('1:0:0', ['4n']));

		// when
		const result = Events.concat(rhy1, R.clone(rhy1));

		// then
		expect(result).toLastAround(Time.T('4m'));
		// expect(result).toMatchSnapshot();
	});
});
