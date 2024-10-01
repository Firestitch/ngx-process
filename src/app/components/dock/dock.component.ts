import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { Observable, Subject, combineLatest, of, timer } from 'rxjs';
import {
  map,
  scan,
  switchMap,
  takeWhile,
  tap,
} from 'rxjs/operators';

import { ProcessState } from '../../enums/process-state';
import { Process } from '../../models/process';
import { LogComponent } from '../log';


@Component({
  templateUrl: './dock.component.html',
  styleUrls: ['./dock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsProcessDockComponent implements OnDestroy, OnInit {

  public processes$: Observable<Process[]>;
  public failed = 0;
  public uploaded = 0;
  public processing = 0;
  public cancelled = 0;
  public uploading = 0;
  public queued = 0;
  public remainingSeconds: number;
  public closingPercent = 0;
  public timeToClose = 10;
  public ProcessState = ProcessState;

  public readyToClose$: Observable<boolean>;
  public closeIn$ = timer(0, 1000)
    .pipe(
      scan((acc) => --acc, this.timeToClose),
      takeWhile((x) => x > 0),
      tap((x) => {
        if (x <= 1) {
          this._dialogRef.close();
        }
      }),
    );

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _dialogData: any,
    private _dialogRef: MatDialogRef<FsProcessDockComponent>,
    private _dialog: MatDialog,
  ) { }

  public ngOnInit(): void {
    this.processes$ = this._dialogData.activeProcesses$;
    this._listenClose();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public viewProcess(process: Process): void {
    this._dialog.open(LogComponent, {
      data: { process },
    });
  }

  private _listenClose(): void {
    this.readyToClose$ = this.processes$
      .pipe(
        map((processes) => {
          return processes.map((process) => process.state$);
        }),
        switchMap((processesState: any[]) => {
          if (processesState.length === 0) {
            return of(true);
          }

          return combineLatest(processesState)
            .pipe(
              tap((states) => {
                const failed = states
                  .some((state) => {
                    return state === ProcessState.Failed;
                  });

                if (failed) {
                  this.timeToClose = 0;
                }
              }),
              map((states) => {
                return states.every((state) => {
                  return state !== ProcessState.Running && state !== ProcessState.Queued;
                });
              }),
            );
        }),
      );
  }

}
