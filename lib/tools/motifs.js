import distribute from './distribute';

const DURATIONS = [ '4n', '8n', '4t', '4nd', '8t', '8nd', '16n' ];

const descending = (durations = DURATIONS) => {
	return distribute.descending(durations);
};

const equal = (durations = DURATIONS) => {
	return distribute.equal(durations);
};

const slow = () => {
	return distribute.descending([ '2n', '4nd', '2nd', '4n' ]);
};

const robotic = () => {
	return distribute.equal([ '8n', '16n', '32n' ]);
};

const straight = () => {
	return distribute.equal([ '2n', '4n', '8n', '16n' ]);
};

export default {
	slow,
	descending,
	equal,
	robotic,
	straight,
};
