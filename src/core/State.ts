import type { Account } from './Account';

export class State {
    readonly accounts: ReadonlyMap<string, Account> = new Map();
}
