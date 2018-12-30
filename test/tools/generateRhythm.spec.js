import { TICKS, RHYTHMS_DISTRIBUTIONS } from '../../lib/constants';
import { seedRandom, generateRhythm, distribute } from '../../lib/tools';

const ONE_BAR = TICKS.get('1n');

const { mixed, slow, robotic, straight } = RHYTHMS_DISTRIBUTIONS;

describe('A generateRhythm Test suite', () => {
	it('should generate rhythm - descending', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateRhythm(ONE_BAR, mixed, distribute.descending);

		// then
		expect(rhythm).to.eql([ '4n', '4t', '8t', '4nd', '8n' ]);
	});
	it('should generate rhythm - slow', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateRhythm(ONE_BAR, slow, distribute.equal);

		// then
		expect(rhythm).to.eql([ '4nd', '4n', '4nd' ]);
	});

	it('should generate rhythm - robotic', () => {
		// given
		seedRandom('test-2');

		// when
		let rhythm = generateRhythm(ONE_BAR, robotic, distribute.equal);

		// then
		expect(rhythm).to.eql([
			'32n',
			'16n',
			'16n',
			'8n',
			'16n',
			'16n',
			'32n',
			'32n',
			'16n',
			'16n',
			'16n',
			'32n',
			'16n',
			'8n',
			'32n',
			'32n',
			'16n',
		]);
	});

	it('should generate rhythm - straight', () => {
		// given
		seedRandom('test');

		// when
		let rhythm = generateRhythm(ONE_BAR, straight, distribute.equal);

		// then
		expect(rhythm).to.eql([ '4n', '16n', '16n', '8n', '4n', '4n' ]);
	});
});
