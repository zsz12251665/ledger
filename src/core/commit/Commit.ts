import type { DateTime } from 'luxon';
import { ImmutableState, MutableState, State } from '../State';

export abstract class Commit {
    readonly date: DateTime;
    readonly parent: Commit | null;
    private cachedState: ImmutableState | null = null;

    get state(): ImmutableState {
        this.cacheState();
        return this.cachedState as ImmutableState;
    }

    private cacheState(depthToCache: number = 0): State {
        if (!depthToCache && this.cachedState !== null) return this.cachedState;
        const previousState = this.parent?.cacheState(depthToCache - 1) ?? new MutableState();
        const state = this.apply(previousState);
        this.cachedState = State.getImmutable(state);
        return state;
    }

    protected abstract apply(previousState: State): State;

    abstract toJSON(): { action: string };

    constructor(date: DateTime, parent?: Commit | undefined | null) {
        this.date = date;
        this.parent = parent ?? null;
    }

    static getCommitPath(head: Commit | null | undefined, root: Commit | null | undefined = null): Commit[] {
        head ??= null;
        root ??= null;

        const path: Commit[] = [];
        for (; head !== null && head !== root; head = head.parent) path.push(head);
        return path.reverse();
    }
}
