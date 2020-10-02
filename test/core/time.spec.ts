import { Time } from '../../lib/core/Time';

describe('Time Test Suite', () => {
	it('should work for ticks', () => {
		const time = new Time(960);

		expect(time.ticks).toBe(960);
		expect(time.notevalue).toBe('2n');
		expect(time.transport).toBe('0:2:0');
	});

	it('should work for notevalues', () => {
		const time = new Time('2n');

		expect(time.ticks).toBe(960);
		expect(time.notevalue).toBe('2n');
		expect(time.transport).toBe('0:2:0');
	});

	it('should work for notevalues', () => {
		const time = new Time('0:2:0');

		expect(time.ticks).toBe(960);
		expect(time.notevalue).toBe('2n');
		expect(time.transport).toBe('0:2:0');
	});

	it('should allow adding', () => {
		const time = new Time('0:2:0');

		expect(time + time).toBe(1920);
	});

	describe('#bbsToTicks', () => {
		it('should convert - position', () => {
			const scenarios = [
				'1:1:0',
				'2:3:0',
				'2:1:1',
				'7:2:2',
				'5:1:3',
				'9:1:0',
			].map((transport) => Time.bbsToTicks(transport, { positionMode: true }));

			expect(scenarios).toMatchInlineSnapshot(`
			Array [
			  0,
			  2880,
			  2040,
			  12240,
			  8040,
			  15360,
			]
		`);
		});

		it('should convert - interval', () => {
			const scenarios = [
				'0:0:0',
				'1:0:0',
				'1:1:0',
				'1:2:0',
				'1:0:1',
				'6:1:2',
				'4:0:0',
				'8:0:0',
			].map((transport) => Time.bbsToTicks(transport));

			expect(scenarios).toMatchInlineSnapshot(`
			Array [
			  0,
			  1920,
			  2400,
			  2880,
			  2040,
			  12240,
			  7680,
			  15360,
			]
		`);
		});
	});

	describe('#ticksToBBS', () => {
		it('should convert - position', () => {
			const scenarios = [
				720,
				960,
				1920,
				2400,
				2880,
				2154,
				12322,
				3360,
				5520,
				15360,
				7680,
			].map((transport) => Time.ticksToBBS(transport, { positionMode: true }));

			expect(scenarios).toMatchInlineSnapshot(`
			Array [
			  "1:2:3",
			  "1:3:1",
			  "2:1:1",
			  "2:2:1",
			  "2:3:1",
			  "2:1:2",
			  "7:2:3",
			  "2:4:1",
			  "3:4:3",
			  "9:1:1",
			  "5:1:1",
			]
		`);
		});

		it('should convert - interval', () => {
			const scenarios = [
				720,
				960,
				2880,
				2154,
				12362,
				3360,
				5520,
				15360,
				7680,
			].map((transport) => Time.ticksToBBS(transport));

			expect(scenarios).toMatchInlineSnapshot(`
			Array [
			  "0:1:2",
			  "0:2:0",
			  "1:2:0",
			  "1:0:1",
			  "6:1:3",
			  "1:3:0",
			  "2:3:2",
			  "8:0:0",
			  "4:0:0",
			]
		`);
		});
	});
});
