import {
	createGrid,
} from '../../../lib/tools/rhythm';

describe('#createGrid', () => {
	it('should create a 8n grid', () => {
		const grid = createGrid(1920, 8);

		expect(grid).toHaveLength(16);
	});

	it('should create a 4n grid', () => {
		const grid = createGrid(3840, 4);

		expect(grid).toHaveLength(16);
	});
});
