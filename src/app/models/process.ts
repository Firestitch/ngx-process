import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { finalize, share, shareReplay } from 'rxjs/operators';

import { FsProcessState } from '../enums/process-state';
import { IProcess } from '../interfaces/process';


export class Process<T extends unknown = unknown> extends Observable<T> {

  private _terminated$ = new Subject<void>();
  public terminated$ = this._terminated$.asObservable();

  private _state$ = new BehaviorSubject(FsProcessState.Queued);
  public state$ = this._state$.pipe(shareReplay(1));

  private _name: string;
  private _target: Observable<unknown>;

  constructor(process: IProcess) {
    super();

    this._init(process);
  }

  public get state(): FsProcessState {
    return this._state$.value;
  }

  public get name(): string {
    return this._name;
  }

  public get target(): Observable<unknown> {
    return this._target;
  }

  public terminate(): void {
    this.setState(FsProcessState.Killed);

    this._terminated$.next();
    this._terminated$.complete();
  }

  public setState(state: FsProcessState): void {
    this._state$.next(state);
  }

  private _init(process: IProcess) {
    this._name = process.name;
    this._target = process.target
      .pipe(
        share(),
        finalize(() => {
          this._state$.complete();
          this._terminated$.complete();
        }),
      );

    this._subscribe = (subscriber => this._target.subscribe(subscriber));
  }

}
