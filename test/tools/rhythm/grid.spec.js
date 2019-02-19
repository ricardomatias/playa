import {
	createGrid,
} from '../../../lib/tools';

describe('#createGrid', () => {
	it('should create a 8n grid', () => {
		let grid = createGrid(1920, 8);

		expect(grid).to.have.length(16);
	});

	it('should create a 4n grid', () => {
		let grid = createGrid(3840, 4);

		expect(grid).to.have.length(16);
	});
});
