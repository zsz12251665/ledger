import * as URI from 'uri-js';
import type { Entry } from './Entry';
import type { Commodity } from './Commodity';
import type { Amount } from './Amount';
import type { State } from './State';

interface IAccount {
    readonly uri: string;
}

export type AccountLike = IAccount | string;

export class Account {
    readonly uri: string;
    readonly active: boolean;
    readonly entries: Entry[];

    get balance(): ReadonlyMap<Commodity, Amount> {
        const balance = new Map<Commodity, Amount>();

        for (const entry of this.entries) {
            const { amount, commodity } = entry.value;
            balance.set(commodity, amount.plus(balance.get(commodity) ?? 0));
        }

        return balance;
    }

    toString(): string {
        return this.uri;
    }

    isEmpty(): boolean {
        for (const amount of this.balance.values()) if (!amount.equals(0)) return false;
        return true;
    }

    protected constructor(uri: string, active: boolean = false, entries: Iterable<Entry> = []) {
        uri = URI.normalize(uri);

        this.uri = uri;
        this.active = active;
        this.entries = [...entries];

        this.entries.forEach((entry) => {
            if (entry.account.uri !== this.uri) throw new RangeError('The entry does not belong the the account');
        });

        if (this.constructor === Account) Object.freeze(this);
    }

    static fromState(state: State, value: AccountLike): Account {
        const uri = URI.normalize(typeof value === 'string' ? value : value.uri);
        return state.accounts.get(uri) ?? new Account(uri);
    }
}

export class MutableAccount extends Account {
    declare active: boolean;
    declare entries: Entry[];

    open(): void {
        if (!this.isEmpty()) throw new Error('The account to be opened is not empty');
        this.active = true;
    }

    close(): void {
        if (!this.isEmpty()) throw new Error('The account to be closed is not empty');
        this.active = false;
    }

    save(): Account {
        return new Account(this.uri, this.active, this.entries);
    }

    static getCopy(account: Account): MutableAccount {
        return new MutableAccount(account.uri, account.active, account.entries);
    }
}

function getNameFromURI(uri: string) {
    const { path } = URI.parse(uri);
    if (!path) throw new SyntaxError('Cannot interpret the path of the URI');
    return decodeURIComponent(path.split('/').slice(-1)[0]);
}
