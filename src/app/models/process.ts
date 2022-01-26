import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { ProcessState } from '../enums/process-state';
import { IProcess } from '../interfaces/process';


export class Process {

  private _terminated$ = new Subject<void>();
  public terminated$ = this._terminated$.asObservable();

  private _state$ = new BehaviorSubject(ProcessState.Queued);
  public state$ = this._state$.asObservable();

  private _name: string;
  private _target: Observable<unknown>;

  constructor(process: IProcess) {
    this._init(process);
  }

  public get state(): ProcessState {
    return this._state$.value;
  }

  public get name(): string {
    return this._name;
  }

  public get target(): Observable<unknown> {
    return this._target;
  }

  public terminate(): void {
    this.setState(ProcessState.Killed);

    this._terminated$.next();
    this._terminated$.complete();
  }

  public setState(state: ProcessState): void {
    this._state$.next(state);
  }

  private _init(process: IProcess) {
    this._name = process.name;
    this._target = process.target;
  }

}
