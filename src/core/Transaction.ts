import { DateTime } from 'luxon';
import type { AccountLike } from './Account';
import { Entry } from './Entry';
import type { ValueLike } from './Value';

export class Transaction {
    date: DateTime;
    private _entries = new Set<Entry>();
    get entries(): ReadonlySet<Entry> {
        return this._entries;
    }

    constructor(date: DateTime) {
        this.date = date;
        if (this.constructor === Transaction) Object.seal(this);
    }

    addEntry(account: AccountLike, value: ValueLike): Entry {
        const entry = new Entry(this, account, value);
        this._entries.add(entry);
        return entry;
    }

    deleteEntry(entry: Entry) {
        return this._entries.delete(entry);
    }
}
