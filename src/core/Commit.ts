import type { DateTime } from 'luxon';

export abstract class Commit {
	constructor(readonly date: DateTime) {}
}
