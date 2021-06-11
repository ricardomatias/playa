import { TurnMoves } from '../../../lib/constants';
import { Key } from '../../../lib/core';
import { createTurnMovement } from '../../../lib/composition';
import { MovementRhythm } from '../../../lib/composition/movement/types';
import random from '../../../lib/tools/random';


describe('A Movement test suite', () => {
	describe('Turn', () => {
		it('should generate a simple movement', () => {
			// given
			random.setSeed('test');

			const aMaj = new Key('C', Key.Major);

			const turns = [
				{ type: TurnMoves.Start, interval: TurnMoves.Free },
				{ type: TurnMoves.ModeUp, interval: 5 },
				{ type: TurnMoves.Free, interval: TurnMoves.Free },
				{ type: TurnMoves.ModulateDown, interval: '5P' },
				{ type: TurnMoves.Start, interval: TurnMoves.Free },
				{ type: TurnMoves.ModeDown, interval: 5 },
				{ type: TurnMoves.ModulateUp, interval: '4P' },
				{ type: TurnMoves.ModeDown, interval: 5 },
			];

			// when
			const movement = createTurnMovement(aMaj, turns, '4:0:0');

			expect(movement.timeline).toHaveLength(8);
			expect(movement).toMatchSnapshot();
		});

		it('should generate non buggy', () => {
			// given
			random.setSeed('massive-dragon-38');

			const cMaj = new Key('C', Key.Lydian);

			const turns = [
				{ type: TurnMoves.Start, interval: 5 },
				{ type: TurnMoves.ModeUp, interval: 4 },
				{ type: TurnMoves.Free, interval: 2 },
				{ type: TurnMoves.Keep, interval: 2 },
				{ type: TurnMoves.ModeUp, interval: 4 },
				{ type: TurnMoves.ModeDown, interval: 5 },
				{ type: TurnMoves.ModulateUp, interval: '2M' },
				{ type: TurnMoves.Free, interval: 2 },
			];

			// when
			const movement = createTurnMovement(cMaj, turns, '4:0:0');

			expect(movement.timeline).toHaveLength(8);
			expect(movement).toMatchSnapshot();
		});

		it('should generate a turn rhythm movement', () => {
			// given
			random.setSeed('test');

			const aMin = new Key('A', Key.Minor);

			const turns = [
				{ type: TurnMoves.Start, interval: TurnMoves.Free },
				{ type: TurnMoves.ModeUp, interval: 5 },
				{ type: TurnMoves.Free, interval: TurnMoves.Free },
				{ type: TurnMoves.ModulateDown, interval: '5P' },
				{ type: TurnMoves.ModeUp, interval: 4 },
				{ type: TurnMoves.ModeDown, interval: 5 },
			];

			// when
			const movement = createTurnMovement(aMin, turns, '4:0:0', { rhythmType: MovementRhythm.Turn });

			expect(movement.timeline).toHaveLength(6);
			expect(movement).toMatchSnapshot();
		});
	});
});
