import { Account, type AccountLike } from './Account';
import { Transaction } from './Transaction';
import { Value, type ValueLike } from './Value';

export class Entry {
    readonly transaction: Transaction;
    readonly account: Account;
    readonly value: Value;

    constructor(transaction: Transaction, account: AccountLike, value: ValueLike) {
        this.transaction = transaction;
        this.account = Account.toAccount(account);
        this.value = Value.toValue(value);
        if (this.constructor === Entry) Object.freeze(this);
    }
}
