import type { DateTime } from 'luxon';
import { ImmutableState, MutableState, State } from '../State';

export abstract class Commit {
    readonly date: DateTime;
    readonly parent: Commit | null;

    get state(): ImmutableState {
        return State.getImmutable(this.getRawState());
    }

    private getRawState(): State {
        const previousState = this.parent?.getRawState() ?? new MutableState();
        return this.apply(previousState);
    }

    protected abstract apply(previousState: State): State;

    abstract toJSON(): { action: string };

    constructor(date: DateTime, parent?: Commit | undefined | null) {
        this.date = date;
        this.parent = parent ?? null;
    }

    static getCommitPath(commit: Commit | null | undefined): Commit[] {
        const path: Commit[] = [];
        for (commit = commit ?? null; commit !== null; commit = commit.parent) path.unshift(commit);
        return path;
    }
}
