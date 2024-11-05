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
    readonly account: Account;
    readonly value: Value;

    get amount(): Amount {
        return this.value.amount;
    }

    get commodity(): Commodity {
        return this.value.commodity;
    }

    toJSON() {
        return {
            account: this.account.toString(),
            amount: this.amount.toString(),
            commodity: this.commodity.toString(),
        };
    }

    protected constructor(transaction: Transaction, account: AccountLike, value: ValueLike) {
        this.transaction = transaction;
        this.account = Account.toAccount(account);
        this.value = Value.toValue(value);

        if (this.constructor === Entry) Object.freeze(this);
    }

    static fromObject(transaction: Transaction, entry: EntryLike): Entry {
        if ('value' in entry) return new Entry(transaction, entry.account, entry.value);
        else return new Entry(transaction, entry.account, entry);
    }
}
