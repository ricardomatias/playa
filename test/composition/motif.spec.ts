import * as R from 'ramda';
import { Scale, Chord } from '../../lib/core';
import { createMotif } from '../../lib/composition/motif';
import { distribute } from '@ricardomatias/roll';
import { chooseMany } from '../../lib/tools/choose';
import * as Rhythm from '../../lib/composition/rhythm';
import random from '../../lib/tools/random';
import { Ticks } from '../../lib/constants';
import '../matchers';

const { Mixed } = Rhythm.Presets;

const ONE_BAR = Ticks['1n'];

describe('A Motif test suite', () => {
	it('should generate motif based on scale', () => {
		// given
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

		let rhythm = Rhythm.free('1:0:0', Mixed, [], distribute.decreasing);

		// when
		let motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(motif).toLastAround(ONE_BAR);

		// when
		random.setSeed('test2');

		rhythm = Rhythm.free('2:0:0', Mixed, [], distribute.decreasing);

		motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(motif).toLastAround(ONE_BAR * 2);
	});

	it('should generate createMotif based on chord', () => {
		// given
		random.setSeed('test');

		const chord = Chord.fromName('Dbm6');
		let rhythm = Rhythm.free('1:0:0', Mixed, [], distribute.decreasing);

		// when
		let motif = createMotif(chord.notes, rhythm);

		expect(motif).toMatchSnapshot();
		expect(motif).toLastAround(ONE_BAR);

		// when
		random.setSeed('test2');

		rhythm = Rhythm.free('2:0:0', Mixed, [], distribute.decreasing);

		motif = createMotif(chord.notes, rhythm);

		expect(motif).toMatchSnapshot();
		expect(motif).toLastAround(ONE_BAR * 2);
	});

	it('should return pattern with time = start time', () => {
		// given
		random.setSeed('test');

		const chord = Chord.fromName('Dbm6');
		const rhythm = Rhythm.free('0:3:0', Mixed);

		const motif = createMotif(chord.notes, rhythm, 480);

		expect(motif).toMatchSnapshot();
	});

	it('should generate motif with rests', () => {
		// given
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);
		const durations = chooseMany(Mixed, random.int(R.length(Mixed)));

		const rhythm = Rhythm.free('1:0:0', Mixed, durations, distribute.decreasing);

		// when
		const motif = createMotif(scale.notes, rhythm);

		// then
		expect(motif).toMatchSnapshot();
		expect(motif).toLastAround(ONE_BAR);
	});

	it('should generate motif with given durations', () => {
		// given
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

		// when
		const motif = createMotif(scale.notes, [ '4n', '2n', '8nd' ]);

		// then
		expect(motif).toMatchSnapshot();
		expect(motif).toLastAround(1800);
	});
});
