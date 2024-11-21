import * as URI from 'uri-js';
import { Balance } from './Balance';
import type { Entry } from './Entry';

interface IAccount {
    readonly uri: string;
}

export type AccountLike = IAccount | string;

export abstract class Account implements IAccount {
    abstract readonly uri: string;
    abstract readonly name: string;
    abstract readonly active: boolean;
    abstract readonly entries: Entry[];

    get balance(): Balance {
        return Balance.fromValues(...this.entries);
    }

    toString(): string {
        return this.uri;
    }

    toJSON() {
        return this.uri;
    }

    static getURI(value: AccountLike): string {
        return URI.normalize(value.toString());
    }

    static getMutable(account: Account, returnCopy = false): MutableAccount {
        if (!returnCopy && account instanceof MutableAccount) return account;
        else return new MutableAccount(account.uri, account.name, account.active, account.entries);
    }

    static getImmutable(account: Account, returnCopy = false): ImmutableAccount {
        if (!returnCopy && account instanceof ImmutableAccount) return account;
        else return new ImmutableAccount(account.uri, account.name, account.active, account.entries);
    }
}

function getNameFromURI(uri: string) {
    const { path } = URI.parse(uri);
    if (!path) throw new SyntaxError('Cannot interpret the path of the URI');
    return decodeURIComponent(path.split('/').slice(-1)[0]);
}

export class ImmutableAccount extends Account {
    readonly uri: string;
    readonly name: string;
    readonly active: boolean;
    readonly entries: Entry[];

    symbol = Symbol();

    constructor(uri: string, name?: string, active: boolean = false, entries?: Iterable<Entry> | undefined | null) {
        super();
        this.uri = Account.getURI(uri);
        this.name = name ?? getNameFromURI(this.uri);
        this.active = active;
        this.entries = [...(entries ?? [])];

        this.entries.forEach((entry) => {
            if (entry.account.uri !== this.uri) throw new RangeError('The entry does not belong the the account');
        });

        if (this.constructor === ImmutableAccount) Object.freeze(this);
    }
}

export class MutableAccount extends Account {
    uri: string;
    name: string;
    active: boolean;
    entries: Entry[];

    open(): void {
        if (!this.balance.isEmpty()) throw new Error('The account to be opened is not empty');
        this.active = true;
    }

    close(): void {
        if (!this.balance.isEmpty()) throw new Error('The account to be closed is not empty');
        this.active = false;
    }

    constructor(uri: string, name?: string, active: boolean = false, entries?: Iterable<Entry> | undefined | null) {
        super();
        this.uri = Account.getURI(uri);
        this.name = name ?? getNameFromURI(this.uri);
        this.active = active;
        this.entries = [...(entries ?? [])];

        this.entries.forEach((entry) => {
            if (entry.account.uri !== this.uri) throw new RangeError('The entry does not belong the the account');
        });
    }
}
