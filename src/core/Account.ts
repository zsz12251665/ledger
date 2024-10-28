import * as URI from 'uri-js';
import type { Entry } from './Entry';
import type { Commodity } from './Commodity';
import type { Amount } from './Amount';

interface IAccount {
    readonly uri: string;
    readonly name?: string;
}

export type AccountLike = Account | IAccount | string;

export class Account {
    readonly uri: string;
    readonly name: string;
    private active: boolean = false;
    private _entries: Entry[] = [];

    private static instances: Map<string, Account> = new Map();

    get entries(): Entry[] {
        let length = 0;
        this._entries.forEach((entry, index, entries) => {
            if (entry.account === this) {
                if (index !== length) entries[length] = entry;
                ++length;
            }
        });
        this._entries.length = length;
        return this._entries;
    }

    get balance(): ReadonlyMap<Commodity, Amount> {
        const balance = new Map<Commodity, Amount>();

        for (const entry of this.entries) {
            const { amount, commodity } = entry.value;
            balance.set(commodity, amount.plus(balance.get(commodity) ?? 0));
        }

        return balance;
    }

    open(): void {
        if (!this.isEmpty()) throw new Error('The account to be opened is not empty');
        this.active = true;
    }

    close(): void {
        if (!this.isEmpty()) throw new Error('The account to be closed is not empty');
        this.active = false;
    }

    isEmpty(): boolean {
        for (const amount of this.balance.values()) if (!amount.equals(0)) return false;
        return true;
    }

    protected constructor(uri: string, name: string) {
        uri = URI.normalize(uri);
        if (Account.instances.has(uri)) throw new RangeError('Duplicated instances for the same account URI');

        this.uri = uri;
        this.name = name;

        if (this.constructor === Account) Object.seal(this);
        Account.instances.set(uri, this);
    }

    static toAccount(value: AccountLike): Account;
    static toAccount(uri: string, name?: string): Account;
    static toAccount(value: AccountLike, name?: string): Account {
        if (typeof value === 'string') return Account.fromURI(value, name);
        if (!(value instanceof Account)) return Account.fromURI(value.uri, value.name);
        return value;
    }

    private static fromURI(uri: string, name?: string): Account {
        uri = URI.normalize(uri);
        const account = Account.instances.get(uri) ?? new Account(uri, name || getNameFromURI(uri));
        if (account.name !== name) console.warn('The specified account name does not match the instance');
        return account;
    }

    static *[Symbol.iterator]() {
        for (const account of Account.instances.values()) {
            if (account.active || !account.isEmpty())
                yield account;
        }
    }
}

function getNameFromURI(uri: string) {
    const { path } = URI.parse(uri);
    if (!path) throw new SyntaxError('Cannot interpret the path of the URI');
    return decodeURIComponent(path.split('/').slice(-1)[0]);
}
