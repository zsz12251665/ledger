import type { DateTime } from 'luxon';
import { Commit } from './Commit';
import { Entry, type EntryLike } from '../Entry';
import { State } from '../State';

export class Transaction extends Commit implements ReadonlySet<Entry> {
    private readonly entrySet: ReadonlySet<Entry>;

    get size() {
        return this.entrySet.size;
    }

    has(value: Entry) {
        return this.entrySet.has(value);
    }

    keys() {
        return this.entrySet.keys();
    }

    values() {
        return this.entrySet.values();
    }

    entries() {
        return this.entrySet.entries();
    }

    [Symbol.iterator]() {
        return this.entrySet.values();
    }

    forEach(callback: (value: Entry, value2: Entry, set: Transaction) => void, thisArg?: any) {
        return this.entrySet.forEach((value, value2) => callback.call(thisArg, value, value2, this));
    }

    toJSON() {
        return {
            action: 'transaction',
            entries: [...this],
        };
    }

    apply(previousState: State) {
        const state = State.getMutable(previousState);
        for (const entry of this.entrySet) {
            const account = state.get(entry.account);
            account.entries.push(entry);
        }
        return state;
    }

    constructor(date: DateTime, entries: Iterable<EntryLike>, parent?: Commit | undefined | null) {
        super(date, parent);
        const entrySet = new Set<Entry>();
        for (const entry of entries) {
            entrySet.add(Entry.fromObject(this, entry));
        }
        this.entrySet = entrySet;

        if (this.constructor === Transaction) Object.freeze(this);
    }
}
