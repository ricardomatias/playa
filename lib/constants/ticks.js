import * as R from 'ramda';

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
	[ '1nd', 2880 ],
	[ '1n', 1920 ],
	[ '1t', 1280 ],
	[ '2nd', 1440 ],
	[ '2n', 960 ],
	[ '2t', 640 ],
	[ '4nd', 720 ],
	[ '4n', 480 ],
	[ '4t', 320 ],
	[ '8nd', 360 ],
	[ '8n', 240 ],
	[ '8t', 160 ],
	[ '16nd', 180 ],
	[ '16n', 120 ],
	[ '16t', 80 ],
	[ '32nd', 90 ],
	[ '32n', 60 ],
	[ '32t', 40 ],
	[ '64nd', 45 ],
	[ '64n', 30 ],
	[ '128n', 15 ],
];

const REV_TICKS = R.map(R.reverse, TICKS);

const ticks = new Map(TICKS);
const revTicks = new Map(REV_TICKS);

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

		if (key === 'get') {
			return function(arg) {
				let value = ticks.get(arg);

				if (!value) {
					value = revTicks.get(arg);
				}

				return value;
			};
		}

		return Reflect.get(target, key, receiver).bind(target);
	},
	set(target, key, value, receiver) {
		return Reflect.set(target, key, value, receiver);
	},
};

export default new Proxy(ticks, handler);
