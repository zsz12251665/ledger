import { Account, ImmutableAccount, MutableAccount, type AccountLike } from './Account';

export abstract class State<TAccount extends Account = Account> implements ReadonlySet<TAccount> {
    protected abstract readonly accounts: ReadonlyMap<string, TAccount>;

    get size() {
        return this.accounts.size;
    }

    has(value: AccountLike) {
        return this.accounts.has(Account.getURI(value));
    }

    keys() {
        return this.accounts.values();
    }

    values() {
        return this.accounts.values();
    }

    *entries() {
        for (const account of this.accounts.values()) yield [account, account] as [TAccount, TAccount];
        return undefined;
    }

    forEach(callback: (value: TAccount, value2: TAccount, set: ReadonlySet<TAccount>) => void, thisArg?: any) {
        return this.accounts.forEach((value) => callback.call(thisArg, value, value, this));
    }

    [Symbol.iterator]() {
        return this.accounts.values();
    }

    abstract get(value: AccountLike): Account;

    static getMutable(state: State, returnCopy = false): MutableState {
        if (!returnCopy && state instanceof MutableState) return state;
        else return new MutableState(...state);
    }

    static getImmutable(state: State, returnCopy = false): ImmutableState {
        if (!returnCopy && state instanceof ImmutableState) return state;
        else return new ImmutableState(...state);
    }
}

export class ImmutableState extends State<ImmutableAccount> implements ReadonlySet<ImmutableAccount> {
    protected readonly accounts: ReadonlyMap<string, ImmutableAccount>;

    declare forEach: (
        callback: (value: ImmutableAccount, value2: ImmutableAccount, set: ImmutableState) => void,
        thisArg?: any,
    ) => void;

    get(value: AccountLike) {
        const uri = Account.getURI(value);
        return this.accounts.get(uri) ?? new ImmutableAccount(uri);
    }

    constructor(...accounts: Account[]) {
        super();
        this.accounts = new Map(accounts.map((account) => [account.uri, Account.getImmutable(account)]));

        if (this.constructor === ImmutableState) Object.freeze(this);
    }
}

export class MutableState extends State<MutableAccount> implements Set<MutableAccount> {
    protected accounts: Map<string, MutableAccount> = new Map();

    get [Symbol.toStringTag]() {
        return 'Set';
    }

    declare forEach: (
        callback: (value: MutableAccount, value2: MutableAccount, set: MutableState) => void,
        thisArg?: any,
    ) => void;

    add(value: Account) {
        this.accounts.set(value.uri, Account.getMutable(value));
        return this;
    }

    delete(value: AccountLike) {
        return this.accounts.delete(Account.getURI(value));
    }

    clear() {
        return this.accounts.clear();
    }

    get(value: AccountLike, persist = true) {
        const uri = Account.getURI(value);
        const account = this.accounts.get(uri) ?? new MutableAccount(uri);
        if (persist) this.add(account);
        return account;
    }

    constructor(...accounts: Account[]) {
        super();
        this.accounts = new Map(accounts.map((account) => [account.uri, Account.getMutable(account)]));
    }
}
