import type { DateTime } from 'luxon';
import { Account, type AccountLike } from '../Account';
import { Commit } from './Commit';
import { State } from '../State';

export class Open extends Commit {
    private readonly accountUri: string;

    get account(): Account {
        return this.state.get(this.accountUri);
    }

    toJSON() {
        return {
            action: 'open',
            account: this.accountUri,
        };
    }

    protected apply(previousState: State) {
        const state = State.getMutable(previousState);
        const account = state.get(this.accountUri);
        account.open();
        return state;
    }

    constructor(date: DateTime, account: AccountLike, parent?: Commit | undefined | null) {
        super(date, parent);
        this.accountUri = Account.getURI(account);
    }
}
