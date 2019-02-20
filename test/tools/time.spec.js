import { transportToTicks, ticksToTransport } from '../../lib/tools';

describe('A Time test suite', () => {
	describe('#transportToTicks', () => {
		it('should be start point', () => {
			expect(transportToTicks('1.1.0')).toBe(0);
		});

		it('should convert to 5280', () => {
			expect(transportToTicks('2.3.0')).toBe(2880);
		});

		it('should convert to 4074', () => {
			expect(transportToTicks('2.1.234')).toBe(2154);
		});

		it('should convert to 12322', () => {
			expect(transportToTicks('7.2.322')).toBe(12322);
		});

		it('should convert to 7680', () => {
			expect(transportToTicks('5.1.0')).toBe(7680);
		});

		it('should convert to 15360', () => {
			expect(transportToTicks('9.1.0')).toBe(15360);
		});
	});

	describe('#ticksToTransport', () => {
		it('should convert to 1.2.211', () => {
			expect(ticksToTransport(720)).toBe('1.2.240');
		});

		it('should convert to 1.2.441', () => {
			expect(ticksToTransport(960)).toBe('1.3.0');
		});

		it('should convert to 2.3.0', () => {
			expect(ticksToTransport(2880)).toBe('2.3.0');
		});

		it('should convert to 2.1.234', () => {
			expect(ticksToTransport(2154)).toBe('2.1.234');
		});

		it('should convert to 7.2.322', () => {
			expect(ticksToTransport(12322)).toBe('7.2.322');
		});

		it('should convert to 2.4.0', () => {
			expect(ticksToTransport(3360)).toBe('2.4.0');
		});

		it('should convert to 3.4.240', () => {
			expect(ticksToTransport(5520)).toBe('3.4.240');
		});

		it('should convert to 9.1.0', () => {
			expect(ticksToTransport(15360)).toBe('9.1.0');
		});

		it('should convert to 5.1.0', () => {
			expect(ticksToTransport(7680)).toBe('5.1.0');
		});
	});
});
