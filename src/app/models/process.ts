import { BehaviorSubject, Observable } from 'rxjs';
import { filter, share } from 'rxjs/operators';

import { ProcessState } from '../enums/process-state';
import { ProcessType } from '../enums/process-type';
import { IProcess } from '../interfaces/process';


export class Process<T extends unknown = unknown> extends Observable<T> {

  private _state$ = new BehaviorSubject(ProcessState.Queued);
  private _message$ = new BehaviorSubject<string>(null);
  private _log$ = new BehaviorSubject<string>('');

  private _type: ProcessType;
  private _name: string;
  private _target: Observable<unknown>;

  constructor(process: IProcess) {
    super();

    this._init(process);
  }

  public get state(): ProcessState {
    return this._state$.value;
  }

  public get name(): string {
    return this._name;
  }

  public get state$(): Observable<ProcessState> {
    return this._state$.asObservable();
  }

  public get completed$(): Observable<any> {
    return this._state$.asObservable()
      .pipe(
        filter((state) => [ProcessState.Cancelled, ProcessState.Failed, ProcessState.Success]
          .indexOf(state) !== -1),
      );
  }

  public get failed$(): Observable<any> {
    return this._state$.asObservable()
      .pipe(
        filter((state) => state === ProcessState.Failed),
      );
  }

  public get cancelled$(): Observable<any> {
    return this._state$.asObservable()
      .pipe(
        filter((state) => state === ProcessState.Cancelled),
      );
  }

  public get log$(): Observable<string> {
    return this._log$.asObservable();
  }

  public appendLog(message: string): void {
    this._log$.next(`${this._log$.value}\n${message}`);
  }

  public get message(): string {
    return this._message$.getValue();
  }

  public set message(message) {
    this._message$.next(message);
  }

  public get message$(): Observable<string> {
    return this._message$.asObservable();
  }

  public get type(): ProcessType {
    return this._type;
  }

  public get target(): Observable<unknown> {
    return this._target;
  }

  public cancel(): void {
    this.setState(ProcessState.Cancelled);
  }

  public setState(state: ProcessState): void {
    this._state$.next(state);
  }

  private _init(process: IProcess) {
    this._name = process.name;
    this._type = process.type;
    this._target = process.target
      .pipe(
        share(),
      );
  }

}
