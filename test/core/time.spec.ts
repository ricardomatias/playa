import Time from '../../lib/core/Time';

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
});
