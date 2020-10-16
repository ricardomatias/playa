import { expandDuration } from "../../lib/tools/event";

describe("An Event tools test suite", () => {
	describe("#expandDuration", () => {
		it("should map pattern - string[]", () => {
			const patt = ["8n", "4n", "2nt"];

			expect(expandDuration(patt)).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "dur": 240,
			    "isRest": false,
			    "next": 240,
			    "time": 0,
			  },
			  Object {
			    "dur": 480,
			    "isRest": false,
			    "next": 720,
			    "time": 240,
			  },
			  Object {
			    "dur": 640,
			    "isRest": false,
			    "next": 1360,
			    "time": 720,
			  },
			]
		`);
		});

		it("should return the same - Event[]", () => {
			const patt = [
				{
					time: 0,
					dur: 480,
					next: 240,
					isRest: false,
				},
				{
					dur: 600,
					time: 0,
					next: 480,
					isRest: false,
				},
				{
					dur: 640,
					time: 0,
					isRest: false,
					next: 1360,
				},
			];

			expect(expandDuration(patt)).toMatchInlineSnapshot(`
			Array [
			  Object {
			    "dur": 480,
			    "isRest": false,
			    "next": 240,
			    "time": 0,
			  },
			  Object {
			    "dur": 600,
			    "isRest": false,
			    "next": 720,
			    "time": 240,
			  },
			  Object {
			    "dur": 640,
			    "isRest": false,
			    "next": 1360,
			    "time": 720,
			  },
			]
		`);
		});
	});
});
