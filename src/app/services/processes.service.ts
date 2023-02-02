import { Injectable } from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';

import { BehaviorSubject, EMPTY, from, Observable, of, Subject, throwError } from 'rxjs';
import { catchError, mergeMap, tap, take, switchMap } from 'rxjs/operators';


import { IProcess } from '../interfaces/process';
import { FsProcessDockComponent } from '../components/dock/dock.component';
import { ProcessState } from '../enums/process-state';
import { Process } from '../models/process';
import { ProcessType } from '../enums/process-type';
import { ProcessConfig } from '../interfaces';


@Injectable({
  providedIn: 'root',
})
export class FsProcesses {

  private _activeDialog: MatDialogRef<any>;
  private _activeProcesses$ = new BehaviorSubject<Process[]>([]);
  private _queue = new Subject<{ process: Process, config: ProcessConfig }>()

  public constructor(
    private _dialog: MatDialog,
    private _overlay: Overlay,
  ) {
    this._initQueueProcessing();
  }

  private get _activeProcesses(): Process[] {
    return this._activeProcesses$.value;
  }

  public addProcess(process: IProcess, config: ProcessConfig): Process {
    return this._pushProcessIntoQueue(process, config);
  }

  private _initQueueProcessing(): void {
    this._queue
      .pipe(
        tap((item) => {
          item.process.setState(ProcessState.Queued);

          this._activeProcesses$.next([
            ...this._activeProcesses,
            item.process,
          ]);
        }),
        tap((item) => {
          this._openProcessesDialog(item.config);
        }),
        mergeMap((item) => {
          item.process.setState(ProcessState.Running);

          return this._wrapProcessTarget(item.process);
        }),
        catchError((error, source$) => {
          console.error(error);

          return EMPTY;
        }),
      )
      .subscribe();
  }

  private _openProcessesDialog(config: ProcessConfig): void {
    if (this._activeDialog) {
      return;
    }

    this._activeDialog = this._dialog
      .open(FsProcessDockComponent, {
        width: '450px',
        hasBackdrop: config?.disableWindow,
        backdropClass: 'fs-process-backdrop',
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

  private _pushProcessIntoQueue(process: IProcess, config: ProcessConfig): Process {
    const p = new Process(process);
    this._queue.next({ process: p, config });

    return p;
  }

  private _wrapProcessTarget(process: Process): Observable<unknown> {
    return from(process.target)
      .pipe(
        switchMap((response: any) => {
          if (process.type === ProcessType.Download) {
            if(!(typeof response === 'string')) {
              return throwError('Download URL invalid');
            }

            (window as any).location = response;
          }

          process.setState(ProcessState.Success);

          return of(response);
        }),
        catchError((e) => {
          process.message = e;
          process.setState(ProcessState.Failed);

          return e;
        }),
      );
  }

}
