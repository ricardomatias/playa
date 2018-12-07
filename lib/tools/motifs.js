import distribute from './distribute';

const DURATIONS = [ '4n', '8n', '4t', '4n.', '8t', '8n.', '16n' ];

const basic = (durations = DURATIONS) => {
	return distribute.descending(durations);
};

const slow = () => {
	return distribute.descending([ '2n', '4n.', '2n.', '4n' ]);
};

const equal = (durations = DURATIONS) => {
	return distribute.equal(durations);
};

export default {
	slow,
	basic,
	equal,
};
