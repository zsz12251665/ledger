import { DateTime } from 'luxon';
import type { AccountLike } from './Account';
import { Entry } from './Entry';
import type { ValueLike } from './Value';

export class Transaction implements ReadonlySet<Entry> {
    date: DateTime;
    private _entries = new Set<Entry>();

    get size() {
        return this._entries.size;
    }

    has(value: Entry) {
        return this._entries.has(value);
    }

    keys() {
        return this._entries.keys();
    }

    values() {
        return this._entries.values();
    }

    entries() {
        return this._entries.entries();
    }

    [Symbol.iterator]() {
        return this._entries.values();
    }

    forEach(callback: (value: Entry, value2: Entry, set: ReadonlySet<Entry>) => void, thisArg?: any) {
        return this._entries.forEach(callback, thisArg);
    }

    add(account: AccountLike, value: ValueLike): Entry {
        const entry = new Entry(this, account, value);
        this._entries.add(entry);
        return entry;
    }

    clear() {
        return this._entries.clear();
    }

    delete(entry: Entry) {
        return this._entries.delete(entry);
    }

    constructor(date: DateTime) {
        this.date = date;
        if (this.constructor === Transaction) Object.seal(this);
    }
}
