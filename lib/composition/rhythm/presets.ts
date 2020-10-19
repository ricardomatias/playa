import { Notevalue } from '../../constants';

export const Presets = <const>{
	Mixed: <Notevalue[]>[ '4n', '8n', '4nt', '4nd', '8nt', '8nd', '16n' ],
	Slow: <Notevalue[]>[ '2n', '4nd', '2nd', '4n' ],
	Robotic: <Notevalue[]>[ '8n', '16n', '32n' ],
	Straight: <Notevalue[]>[ '2n', '4n', '8n', '16n' ],
	Common: <Notevalue[]>[ '4n', '8n', '16n', '4nt', '8nt', '4nd' ],
};

export type Presets = typeof Presets[keyof typeof Presets]

