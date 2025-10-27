import { Injectable, inject } from '@angular/core';

import { Overlay } from '@angular/cdk/overlay';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { StreamEventData } from '@firestitch/api';
import { Queue } from '@firestitch/common';

import { BehaviorSubject, EMPTY, Subject, throwError } from 'rxjs';
import { catchError, take, tap } from 'rxjs/operators';


import { HttpErrorResponse } from '@angular/common/http';

import { FsProcessDockComponent } from '../components/dock/dock.component';
import { ProcessState } from '../enums/process-state';
import { ProcessType } from '../enums/process-type';
import { ProcessConfig } from '../interfaces';
import { IProcess } from '../interfaces/process';
import { Process } from '../models/process';


@Injectable({
  providedIn: 'root',
})
export class FsProcesses {
  private _dialog = inject(MatDialog);
  private _overlay = inject(Overlay);


  private _queue = new Queue(3);
  private _activeDialog: MatDialogRef<any>;
  private _activeProcesses$ = new BehaviorSubject<Process[]>([]);
  private _queue$ = new Subject<{ process: Process; config: ProcessConfig }>();

  constructor() {
    this._initQueueProcessing();
  }

  private get _activeProcesses(): Process[] {
    return this._activeProcesses$.value;
  }

  public setLimit(value) {
    this._queue.setLimit(value);
  }

  public addProcess(process: IProcess, config: ProcessConfig): Process {
    return this._pushProcessIntoQueue(process, config);
  }

  private _initQueueProcessing(): void {
    this._queue$
      .pipe(
        tap(({ process }: { process: Process; config: ProcessConfig }) => {
          process.setState(ProcessState.Queued);

          this._activeProcesses$.next([
            ...this._activeProcesses,
            process,
          ]);
        }),
        tap(({ config }: { process: Process; config: ProcessConfig }) => {
          this._openProcessesDialog(config);
        }),
        tap((item) => {
          item.process.setState(ProcessState.Running);

          this._wrapProcessTarget(item.process);
        }),
        catchError((error) => {
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

    const position = config.position === 'bottomRight' ?
      { bottom: '0px', right: '0px' } : undefined;
   
    this._activeDialog = this._dialog
      .open(FsProcessDockComponent, {
        width: '450px',
        hasBackdrop: false,
        backdropClass: 'fs-process-backdrop',
        panelClass: 'fs-process-pane',
        position,
        disableClose: true,
        autoFocus: false,
        scrollStrategy: this._overlay.scrollStrategies.noop(),
        data: {
          activeProcesses$: this._activeProcesses$,
        },
      });

    this._activeDialog
      .afterClosed()
      .pipe(
        take(1),
      )
      .subscribe(() => {
        this._activeDialog = null;
        this._activeProcesses$.next([]);
      });
  }

  private _pushProcessIntoQueue(process: IProcess, config: ProcessConfig): Process {
    const p = new Process(process);
    config = {
      ...config,
      position: config?.position || 'bottomRight',
    };

    this._queue$.next({ process: p, config });

    return p;
  }

  private _wrapProcessTarget(process: Process): any {
    this._queue.push(
      process.target
        .pipe(
          tap({
            next: (response: any) => {
              if (process.type === ProcessType.Download) {
                if (!(typeof response === 'string')) {
                  return throwError('Download URL invalid');
                }

                (window as any).location = response;
              } else if (process.type === ProcessType.Run) {
                if (response instanceof StreamEventData) {
                  process.message = response.data;
                  process.appendLog(response.data);
                } else if (typeof response === 'string') {
                  process.message = response;
                  process.appendLog(response);
                }
              }
            },
            complete: () => {
              process.message = 'Completed';
              process.setState(ProcessState.Success);
            },
          }),
          catchError((e) => {
            let message = 'Process failed';
            if (e instanceof HttpErrorResponse && e.statusText) {
              message = e.statusText;
            } else if (typeof e === 'string' && e) {
              message = e;
            }

            process.message = message;
            process.setState(ProcessState.Failed);

            return throwError(e);
          }),
        ),
    );
  }

}
