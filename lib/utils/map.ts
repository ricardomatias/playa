import * as R from 'ramda';
import { NoteSymbol } from '../constants';
import { Note } from '../core';
import { isDefined } from './types-guards';

/**
 * Maps an array of notes into a specified type
 *
 * @private
 *
 * @function mapNotesToMidi
 * @memberof Utils
 *
 * @param {Array<Note>} notes
 * @return {Array<Number>} Notes mapped to a type
 */
export const mapNotesToMidi = (notes: Note[]): number[] => R.map(R.prop('midi'), notes).filter(isDefined);
export const mapNotesToFreq = (notes: Note[]): number[] => R.map(R.prop('freq'), notes).filter(isDefined);
export const mapNotesToString = (notes: Note[]): string[] => R.map(R.prop('pitch'), notes).filter(isDefined);
export const mapNotesToSymbol = (notes: Note[]): NoteSymbol[] => R.map(R.prop('note'), notes).filter(isDefined);
