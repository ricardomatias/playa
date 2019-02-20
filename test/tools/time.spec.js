import { transportToTicks, ticksToTransport } from '../../lib/tools';

describe('A Time test suite', () => {
	describe('#transportToTicks', () => {
		it('should be start point', () => {
			expect(transportToTicks('1.1.0')).to.eql(0);
		});

		it('should convert to 5280', () => {
			expect(transportToTicks('2.3.0')).to.eql(2880);
		});

		it('should convert to 4074', () => {
			expect(transportToTicks('2.1.234')).to.eql(2154);
		});

		it('should convert to 12322', () => {
			expect(transportToTicks('7.2.322')).to.eql(12322);
		});

		it('should convert to 7680', () => {
			expect(transportToTicks('5.1.0')).to.eql(7680);
		});

		it('should convert to 15360', () => {
			expect(transportToTicks('9.1.0')).to.eql(15360);
		});
	});

	describe('#ticksToTransport', () => {
		it('should convert to 1.2.211', () => {
			expect(ticksToTransport(720)).to.eql('1.2.240');
		});

		it('should convert to 1.2.441', () => {
			expect(ticksToTransport(960)).to.eql('1.3.0');
		});

		it('should convert to 2.3.0', () => {
			expect(ticksToTransport(2880)).to.eql('2.3.0');
		});

		it('should convert to 2.1.234', () => {
			expect(ticksToTransport(2154)).to.eql('2.1.234');
		});

		it('should convert to 7.2.322', () => {
			expect(ticksToTransport(12322)).to.eql('7.2.322');
		});

		it('should convert to 2.4.0', () => {
			expect(ticksToTransport(3360)).to.eql('2.4.0');
		});

		it('should convert to 3.4.240', () => {
			expect(ticksToTransport(5520)).to.eql('3.4.240');
		});

		it('should convert to 9.1.0', () => {
			expect(ticksToTransport(15360)).to.eql('9.1.0');
		});

		it('should convert to 5.1.0', () => {
			expect(ticksToTransport(7680)).to.eql('5.1.0');
		});
	});
});
