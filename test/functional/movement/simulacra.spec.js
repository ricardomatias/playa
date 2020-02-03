import { Key } from '../../../lib/core';
import { createMovementX } from '../../../lib/functional';
import { seedRandom } from '../../../lib/tools/random';

const noteOpts = { noteType: 'note' };


describe('A Movement test suite', () => {
	describe('SIMULACRA', () => {
		it.only('should generate a simple movement', () => {
			// given
			seedRandom('test');

			const aMaj = new Key('C', Key.MAJOR, noteOpts);

			const turns = [
				{ type: '▼', interval: '⟷' },
				{ type: '↑', interval: 5 },
				{ type: '⟷', interval: '⟷' },
				{ type: '⤥', interval: '5P' },
				{ type: '▼', interval: '⟷' },
				{ type: '↓', interval: 5 },
				{ type: '⤤', interval: '4P' },
				{ type: '↓', interval: 5 },
			];

			// when
			const movement = createMovementX(aMaj, turns, '4.0.0');

			expect(movement.timeline).toHaveLength(8);
			expect(movement).toMatchSnapshot();
		});

		it('should generate a simple movement non buggy', () => {
			// given
			seedRandom('massive-dragon-38');

			const cMaj = new Key('C', Key.LYDIAN, noteOpts);

			const turns = [
				{ type: '▼', interval: 5 },
				{ type: '↑', interval: 4 },
				{ type: '⟷', interval: 2 },
				{ type: '➜', interval: 2 },
				{ type: '↑', interval: 4 },
				{ type: '↓', interval: 5 },
				{ type: '⤤', interval: '2M' },
				{ type: '⟷', interval: 2 },
			];

			// when
			const movement = createMovementX(cMaj, turns, '4.0.0');
			console.log(JSON.stringify(movement, null, '\t'));

			expect(movement.timeline).toHaveLength(8);
			expect(movement).toMatchSnapshot();
		});

		it('should generate a turn rhythm movement', () => {
			// given
			seedRandom('test');

			const aMin = new Key('A', Key.MINOR, noteOpts);

			const turns = [
				{ type: '▼', interval: '⟷' },
				{ type: '↑', interval: 5 },
				{ type: '⟷', interval: '⟷' },
				{ type: '⤥', interval: '5P' },
				{ type: '↑', interval: 4 },
				{ type: '↓', interval: 5 },
			];

			// when
			const movement = createMovementX(aMin, turns, '4.0.0', { rhythm: 'turn' });

			expect(movement.timeline).toHaveLength(6);
			expect(movement).toMatchSnapshot();
		});
	});
});
