import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

import { BehaviorSubject, EMPTY, from, Observable, Subject } from 'rxjs';
import { catchError, filter, mergeMap, takeUntil, tap, take } from 'rxjs/operators';


import { IProcess } from '../interfaces/process';
import { FsProcessDockComponent } from '../components/dock/dock.component';
import { ProcessState } from '../enums/process-state';
import { Process } from '../models/process';


@Injectable({
  providedIn: 'root',
})
export class FsProcesses {

  private _activeDialog: MatDialogRef<any>;

  private _activeProcesses$ = new BehaviorSubject<Process[]>([]);
  private _queue = new Subject<Process>()

  public constructor(
    @Inject(DOCUMENT)
    private _DOCUMENT: Document,
    private _dialog: MatDialog,
    private _overlay: Overlay,
  ) {
    this._initQueueProcessing();
  }

  private get _activeProcesses(): Process[] {
    return this._activeProcesses$.value;
  }

  private get _window(): Window {
    return this._DOCUMENT.defaultView;
  }

  public addProcess(process: IProcess): Process {
    return this._pushProcessIntoQueue(process);
  }

  private _initQueueProcessing(): void {
    this._queue
      .pipe(
        filter((process) => {
          return !this._activeProcesses
            .find((p) => p.name === process.name);
        }),
        tap((process) => {
          process.setState(ProcessState.Queued);

          this._activeProcesses$.next([
            ...this._activeProcesses,
            process,
          ]);
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

    this._activeDialog
      .afterClosed()
      .pipe(
        take(1),
      )
      .subscribe(() => {
        this._activeDialog = null;
        this._activeProcesses$.next([]);
      })
  }

  private _pushProcessIntoQueue(process: IProcess): Process {
    const existingProcess = this._processByName(process.name);

    if (!existingProcess) {
      const p = new Process(process);

      this._queue.next(p);

      return p;
    } else {
      return existingProcess;
    }
  }

  private _removeProcessFromQueue(name: string): void {
    const activeProcesses = this._activeProcesses$.value;
    const pIdx = activeProcesses
      .findIndex((p) => p.name == name);

    if (pIdx > -1) {
      this._activeProcesses$.next(
        activeProcesses.filter((_, index) => index !== pIdx)
      );
    }
  }

  private _processByName(name: string): Process {
    return this._activeProcesses$.value
      .find((p) => p.name === name);
  }

  private _wrapProcessTarget(process: Process): Observable<unknown> {
    return from(process.target)
      .pipe(
        tap(() => {
          process.setState(ProcessState.Completed);
        }),
        tap((response: any) => {
          if (response.data?.url) {
            this._window.open(response.data?.url, '_blank');
          }
        }),
        catchError((e) => {
          process.setState(ProcessState.Failed);

          return e;
        }),
        takeUntil(process.terminated$),
      );
  }

}
