import { TICKS, RHYTHMS_DISTRIBUTIONS } from '../../../lib/constants';
import {
	seedRandom,
	generateFreeRhythm,
	distribute,
} from '../../../lib/tools';

const ONE_BAR = TICKS.get('1n');

const { mixed, slow, robotic, straight } = RHYTHMS_DISTRIBUTIONS;

describe('#generateFreeRhythm', () => {
	it('should generate rhythm - descending', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateFreeRhythm(ONE_BAR, mixed, distribute.descending);

		// then
		expect(rhythm).to.eql([ '8n', '4n', '8t', '8n', '16n', '4t', '8n', '16n' ]);
	});
	it('should generate rhythm - slow', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateFreeRhythm(ONE_BAR, slow, distribute.equal);

		// then
		expect(rhythm).to.eql([ '4nd', '4nd', '4n' ]);
	});

	it('should generate rhythm - robotic', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateFreeRhythm(ONE_BAR, robotic, distribute.equal);

		// then
		expect(rhythm).to.eql([
			'16n',
			'8n',
			'32n',
			'16n',
			'32n',
			'16n',
			'16n',
			'32n',
			'32n',
			'16n',
			'32n',
			'32n',
			'32n',
			'16n',
			'16n',
			'8n',
			'16n',
			'32n',
		]);
	});

	it('should generate rhythm - straight', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateFreeRhythm(ONE_BAR, straight, distribute.equal);

		// then
		expect(rhythm).to.eql([ '4n', '4n', '16n', '4n', '16n', '8n' ]);
	});
});
