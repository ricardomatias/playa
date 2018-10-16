// 1nd - Dotted whole note - (2880 ticks)
// 1n - Whole note - (1920 ticks)
// 1t - Whole note triplet - (1280 ticks)
// 2nd - Dotted half note - (1440 ticks)
// 2n - Half note - (960 ticks)
// 2t - Half note triplet - (640 ticks)
// 4nd - Dotted quarter note - (720 ticks)
// 4n - Quarter note - (480 ticks)
// 4t - Quarter note triplet - (320 ticks)
// 8nd - Dotted eighth note - (360 ticks)
// 8n - Eighth note - (240 ticks)
// 8t - Eighth note triplet - (160 ticks)
// 16nd - Dotted sixteeth note - (180 ticks)
// 16n - Sixteeth note - (120 ticks)
// 16t - Sixteeth note triplet - (80 ticks)
// 32nd - Dotted thirty - second note - (90 ticks)
// 32n - thirty - second note - (60 ticks)
// 32t - thirty - second - note triplet - (40 ticks)
// 64nd - Dotted sixty - fourth note - (45 ticks)
// 64n - Sixty - fourth note - (30 ticks)
// 128n - One - hundred - twenty - eighth note - (15 ticks)

const TICKS = [
	[ '1m', 768 ],
	[ '1t', 512 ],
	// SECTION 2
	// PROBABILITY 0.3
	[ '2n.', 576 ],
	[ '2n', 384 ],
	[ '2t', 256 ],
	// END SECTION 2
	// SECTION 1
	// PROBABILITY 0.5
	[ '4n.', 288 ],
	[ '4n', 192 ],
	[ '4t', 128 ],
	[ '8n.', 144 ],
	[ '8n', 96 ],
	[ '8t', 64 ],
	// END SECTION 1
	// SECTION 2
	// PROBABILITY 0.3
	[ '16n.', 72 ],
	[ '16n', 48 ],
	[ '16t', 32 ],
	[ '32n.', 36 ],
	// END SECTION 2
	// SECTION 3
	// PROBABILITY 0.5
	[ '32n', 24 ],
	[ '32t', 16 ],
	[ '64n.', 18 ],
	[ '64n', 12 ],
	[ '64t', 8 ],
	[ '128n', 6 ],
];

const ticks = new Map(TICKS);

const handler = {
	getPrototypeOf(target) {
		return target.prototype;
	},
	get(target, key, receiver) {
		if (key === 'toArray') {
			return function() {
				const ticksArray = [];

				TICKS.forEach((tick) => ticksArray.push(tick));

				return ticksArray;
			};
		}
		return Reflect.get(target, key, receiver).bind(target);
	},
	set(target, key, value, receiver) {
		return Reflect.set(target, key, value, receiver);
	},
};

export default new Proxy(ticks, handler);
