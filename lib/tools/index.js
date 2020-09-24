/**
 * The Toolshed
 * @namespace {module} Tools
 */
export { choose, chooseMany } from './choose';
export { default as shuffle } from './shuffle';
export { default as rotate } from './rotate';
export { default as distance } from './distance';
export { default as interval } from './interval';
export { default as friendly } from './friendly';
export { default as euclidean } from './euclidean';
export { default as Sequence } from './sequence';
export { default as Random } from './random';

import * as Time from './time';
import * as Rhythm from './rhythm';
import * as Midi from './midi';

export * from './ping';
export * from '@ricardomatias/roll';

export {
	Time,
	Rhythm,
	Midi,
};
