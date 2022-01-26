import { Injectable } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

import { BehaviorSubject, EMPTY, from, Observable, Subject } from 'rxjs';
import { catchError, distinct, finalize, mergeMap, tap } from 'rxjs/operators';


import { IProcess } from '../interfaces/process';
import { FsProcessDockComponent } from '../components/dock/dock.component';
import { ProcessState } from '../enums/process-state';
import { Process } from '../models/process';


@Injectable({
  providedIn: 'root',
})
export class FsProcesses {

  private _queue$ = new Subject<IProcess>();
  private _activeDialog: MatDialogRef<any>;

  private _activeProcesses$ = new BehaviorSubject<Process[]>([]);

  public constructor(
    private _dialog: MatDialog,
    private _overlay: Overlay,
  ) {
    this._activeProcesses$
      .pipe(
        mergeMap((processes) => {
          return from(processes);
        }),
        distinct((process) => process.name),
        tap((process) => {
          process.setState(ProcessState.Queued);
        }),
        tap(() => {
          this._openProcessesDialog();
        }),
        mergeMap((process) => {
          process.setState(ProcessState.Running);

          return this._wrapProcessTarget(process);
        }),
        catchError((error, source$) => {
          console.error(error);

          return EMPTY;
        }),
      )
      .subscribe();
  }

  public get processes$(): Observable<IProcess> {
    return this._queue$;
  }

  public addProcess(process: IProcess) {
    this._pushProcessIntoQueue(process);
  }

  private _openProcessesDialog(): void {
    if (this._activeDialog) {
      return;
    }

    this._activeDialog = this._dialog
      .open(FsProcessDockComponent, {
        width: '450px',
        hasBackdrop: false,
        panelClass: 'fs-process-pane',
        position: { bottom: '20px', right: '20px' },
        disableClose: true,
        autoFocus: false,
        scrollStrategy: this._overlay.scrollStrategies.noop(),
        data: {
          activeProcesses$: this._activeProcesses$,
        }
      });
  }

  private _closeProcessesDialog(): void {
    if (this._activeProcesses$.value.length === 0) {
      this._activeDialog?.close();
      this._activeDialog = null;
    }
  }

  private _pushProcessIntoQueue(process: IProcess) {
    const processExists = this._processExists(process.name);

    if (!processExists) {
      const p = new Process(process);

      const activeProcesses = [
        ...this._activeProcesses$.value,
        p,
      ];

      this._activeProcesses$.next(activeProcesses);
    }
  }

  private _removeProcessFromQueue(name: string): void {
    const activeProcesses = this._activeProcesses$.value;
    const pIdx = activeProcesses
      .findIndex((p) => name);

    if (pIdx > -1) {
      this._activeProcesses$.next(
        activeProcesses.filter((_, index) => index !== pIdx)
      );
    }
  }

  private _processExists(name: string): boolean {
    return !!this._activeProcesses$.value
      .find((p) => p.name === name);
  }

  private _wrapProcessTarget(process: Process): Observable<unknown> {
    return from(process.target)
      .pipe(
        tap(() => {
          process.setState(ProcessState.Completed);
        }),
        catchError((e) => {
          process.setState(ProcessState.Failed);

          return e;
        }),
        finalize(() => {
          this._removeProcessFromQueue(process.name);

          setTimeout(() => {
            this._closeProcessesDialog();
          });
        }),
      );
  }

}
