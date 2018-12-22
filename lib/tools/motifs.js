import distribute from './distribute';

const DURATIONS = [ '4n', '8n', '4t', '4nd', '8t', '8nd', '16n' ];

const basic = (durations = DURATIONS) => {
	return distribute.descending(durations);
};

const slow = () => {
	return distribute.descending([ '2n', '4nd', '2nd', '4n' ]);
};

const equal = (durations = DURATIONS) => {
	return distribute.equal(durations);
};

export default {
	slow,
	basic,
	equal,
};
