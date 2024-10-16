import { describe, it, expect } from 'vitest';
import { Rhythm, Events, createMotif, createArp } from '../../../lib/composition';
import { Scale } from '../../../lib/core';
import { convertEventsToNotevalues, random } from '../../../lib/tools';
import '../../matchers';

describe('#select', () => {
	it('should select every 2n before after 4n', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('4:0:0', ['4n']);

		// when
		const after = Events.select(rhythm).every('2n').after('4n').rest();
		const before = Events.select(rhythm).before('2m').rest();

		expect(after).toMatchSnapshot();
		expect(before).toMatchSnapshot();
	});

	it('should select before after 2n', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:0:0', ['8n']);

		// when
		const after = Events.select(rhythm).after('2n').rest();
		const before = Events.select(rhythm).before('2n').rest();

		expect(after).toMatchSnapshot();
		expect(before).toMatchSnapshot();
	});

	it('should select applyRest', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:0:0', ['8n']);

		// when
		const results = Events.select(rhythm)
			.before('2n')
			.applyRest(() => random.boolean());

		expect(results).toMatchSnapshot();
	});

	it('should select multiple', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('1:0:0', ['8n']);

		// when
		const results = Events.select(rhythm).before('0:2:0').after('0:1:0').rest();
		const results2 = Events.select(rhythm).between('0:1:0', '0:2:0').rest();
		const results3 = Events.select(Rhythm.free('4:0:0', ['4n']))
			.every('1:0:0')
			.between('0:1:0', '0:2:0')
			.rest();

		expect(results).toMatchObject(results2);
		expect(results).toMatchSnapshot();
		expect(results3).toMatchSnapshot();
	});

	it('should insert simple', () => {
		// given
		random.setSeed('test');

		const rhythm = Rhythm.free('2:0:0', ['8n']);
		const rhythm2 = Rhythm.free('2n', ['4n']);

		const notes = new Scale('A', Scale.Major).notes;

		const motif = createMotif(notes, rhythm);
		const motif2 = createMotif(notes, rhythm2);

		// when
		const results = Events.select(motif).every('1:0:0').after('2n').insert(motif2);

		expect(convertEventsToNotevalues(results)).toEqual([
			'8n',
			'8n',
			'8n',
			'8n',
			'4n',
			'4n',
			'8n',
			'8n',
			'8n',
			'8n',
			'4n',
			'4n',
		]);
	});

	it('should insert complex', () => {
		// given
		random.setSeed('test');

		const scale = new Scale('A', Scale.Major);

		const motif = Events.expand(createArp(scale, [1, 3, '-7'], ['4n', '4nd']), '2m');
		const rhythm2 = Rhythm.free('2n', Rhythm.Presets.Mixed);
		const motif2 = createMotif(scale.notes, rhythm2);

		// when
		const results = Events.select(motif).before('1m').after('2n').insert(motif2);

		expect(convertEventsToNotevalues(motif)).toMatchInlineSnapshot(`
		[
		  "4n",
		  "4nd",
		  "4n",
		  "4n",
		  "4nd",
		  "4n",
		  "4n",
		]
	`);
		expect(convertEventsToNotevalues(results)).toMatchInlineSnapshot(`
		[
		  "4n",
		  "4nd",
		  "4nd",
		  "16n",
		  "16n",
		  "4nd",
		  "4n",
		  "4n",
		]
	`);
	});
});
