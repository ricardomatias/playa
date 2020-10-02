import { Ticks } from '../../lib/constants';

describe('Ticks Test Suite', () => {
	it('should access Ticks', () => {
		const Tickss = Ticks['4n'];

		expect(Tickss).toBe(480);
	});

	it('should access notevalue', () => {
		const notevalue = Ticks[480];

		expect(notevalue).toBe('4n');
	});

	it('should fail', () => {
		const notevalue = Ticks[1];

		expect(notevalue).toBeUndefined;
	});
});
