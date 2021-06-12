/**
 * @param time
 * @param dur
 * @param next the next event's time - this allows having note overlap
 * @param isRest
 */
export interface Event {
	time: number;
	dur: number;
	next: number;
	isRest: boolean;
}

export const Event = ({ time = 0, dur = 0, next = 0, isRest = false }: Partial<Event>): Event => {
	return Object.assign(
		{},
		{
			time,
			dur,
			next,
			isRest,
		}
	);
};
