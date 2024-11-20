import { Account, type AccountLike } from './Account';
import type { AmountLike } from './Amount';
import type { CommodityLike } from './Commodity';
import type { Transaction } from './commit/Transaction';
import { Value, type ValueLike } from './Value';

interface IEntry {
    readonly account: AccountLike;
    readonly amount: AmountLike;
    readonly commodity: CommodityLike;
}

interface IEntryWithValue {
    readonly account: AccountLike;
    readonly value: ValueLike;
}

export type EntryLike = IEntry | IEntryWithValue;

export class Entry extends Value implements IEntry {
    readonly transaction: Transaction;
    private readonly accountUri: string;

    get account(): Account {
        return this.transaction.state.get(this.accountUri);
    }

    toJSON(): IEntry {
        return {
            account: this.accountUri,
            amount: this.amount.toString(),
            commodity: this.commodity.toString(),
        };
    }

    protected constructor(
        transaction: Transaction,
        account: AccountLike,
        amount: AmountLike,
        commodity: CommodityLike,
    ) {
        super(amount, commodity);
        this.transaction = transaction;
        this.accountUri = Account.getURI(account);

        if (this.constructor === Entry) Object.freeze(this);
    }

    static fromObject(transaction: Transaction, entry: EntryLike): Entry {
        if ('value' in entry) {
            const value = Value.toValue(entry.value);
            return new Entry(transaction, entry.account, value.amount, value.commodity);
        } else {
            return new Entry(transaction, entry.account, entry.amount, entry.commodity);
        }
    }
}
