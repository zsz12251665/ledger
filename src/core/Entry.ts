import { Account, type AccountLike } from './Account';
import type { Amount, AmountLike } from './Amount';
import type { Commodity, CommodityLike } from './Commodity';
import { Transaction } from './Transaction';
import { Value, type ValueLike } from './Value';

interface IEntry {
    readonly account: AccountLike;
    readonly value: ValueLike;
}

interface IValueWithAccount {
    readonly account: AccountLike;
    readonly amount: AmountLike;
    readonly commodity: CommodityLike;
}

export type EntryLike = IEntry | IValueWithAccount;

export class Entry {
    readonly transaction: Transaction;
    private readonly accountUri: string;
    readonly value: Value;

    get account(): Account {
        return this.transaction.state.accounts.get(this.accountUri) as Account;
    }

    get amount(): Amount {
        return this.value.amount;
    }

    get commodity(): Commodity {
        return this.value.commodity;
    }

    toJSON() {
        return {
            account: this.accountUri,
            amount: this.amount.toString(),
            commodity: this.commodity.toString(),
        };
    }

    protected constructor(transaction: Transaction, account: AccountLike, value: ValueLike) {
        this.transaction = transaction;
        this.accountUri = typeof account === 'string' ? account : account.uri;
        this.value = Value.toValue(value);

        if (this.constructor === Entry) Object.freeze(this);
    }

    static fromObject(transaction: Transaction, entry: EntryLike): Entry {
        if ('value' in entry) return new Entry(transaction, entry.account, entry.value);
        else return new Entry(transaction, entry.account, entry);
    }
}
