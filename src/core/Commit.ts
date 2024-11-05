import type { DateTime } from 'luxon';
import { State } from './State';

export abstract class Commit {
	readonly state: State = new State();
	constructor(readonly date: DateTime) {}
}
