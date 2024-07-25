import type { Entry } from './Entry';

export type AccountLike = Account | string;

export class Account {
    readonly name: string;
    entries: Set<Entry> = new Set();

    static toAccount(value: AccountLike): Account {
        if (typeof value === 'string') return Account.fromName(value);
        return value;
    }

    protected constructor(name: string) {
        this.name = name;
        if (this.constructor === Account) Object.seal(this);
    }

    private static nameMap: Map<string, Account> = new Map();

    private static fromName(name: string): Account {
        if (Account.nameMap.has(name)) {
            return Account.nameMap.get(name) as Account;
        } else {
            const account = new Account(name);
            Account.nameMap.set(name, account);
            return account;
        }
    }
}
