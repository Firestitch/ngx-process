import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Observable, of, Subject, timer, combineLatest } from 'rxjs';
import {
  scan,
  switchMap,
  takeWhile,
  finalize,
  map,
} from 'rxjs/operators';

import { Process } from '../../models/process';
import { ProcessState } from '../../enums/process-state';


@Component({
  templateUrl: 'dock.component.html',
  styleUrls: ['dock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsProcessDockComponent implements OnDestroy, OnInit {

  public readonly timeToClose = 100000;

  public processes$: Observable<Process[]>;
  public failed = 0;
  public uploaded = 0;
  public processing = 0;
  public cancelled = 0;
  public uploading = 0;
  public queued = 0;
  public remainingSeconds: number;
  public closingPercent = 0;

  public processStates = ProcessState;

  public readyToClose$: Observable<boolean>;
  public closeIn$ = timer(0, 1000)
    .pipe(
      scan(acc => --acc, this.timeToClose),
      takeWhile((x) => x > 0),
      finalize(() => {
        this._dialogRef.close();
      })
    );

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _dialogData: any,
    private _dialogRef: MatDialogRef<FsProcessDockComponent>,
    private _cdRef: ChangeDetectorRef,
  ) {
    this.processes$ = _dialogData.activeProcesses$;
  }

  public ngOnInit(): void {
    this._listenClose();
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
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
