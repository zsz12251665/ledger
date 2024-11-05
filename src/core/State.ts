import type { Account } from './Account';

export class State {
	readonly accounts: ReadonlyMap<string, Account>;

	isMutable(): this is MutableState {
		return !Object.isFrozen(this);
	}

	constructor(accounts: Iterable<Account> = []) {
		const map = new Map<string, Account>();
		for (const account of accounts) {
			if (map.has(account.uri)) throw new RangeError('Duplicated instances for the same account URI');
			map.set(account.uri, account);
		}
		this.accounts = map;

        if (this.constructor === State) Object.freeze(this);
	}
}

export class MutableState extends State {
	declare accounts: Map<string, Account>;

	save(): State {
		Object.freeze(this);
		return this;
	}

	static getCopy(state: State): MutableState {
		return new MutableState(state.accounts.values());
	}
}
