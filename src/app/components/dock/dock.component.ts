
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Subject, interval } from 'rxjs';
import { takeUntil, debounceTime, switchMap, map } from 'rxjs/operators';
import { FsProcesses } from '../../services/processes.service';


@Component({
  templateUrl: 'dock.component.html',
  styleUrls: ['dock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsProcessDockComponent implements OnDestroy, OnInit {

  public processes = [];
  public failed = 0;
  public uploaded = 0;
  public processing = 0;
  public cancelled = 0;
  public uploading = 0;
  public queued = 0;
  public remainingSeconds: number;
  public closingPercent = 0;
  public closingTimeout = 10;
  public closingSeconds = null;
  public uploadTotalBytes = 0;
  public uploadLoadedBytes = 0;
  public bytesPerSecond: number[] = [];

  private _destroy$ = new Subject<void>();

  constructor(
    private _dialogRef: MatDialogRef<FsProcessDockComponent>,
    private _processes: FsProcesses,
    private _cdRef: ChangeDetectorRef,
  ) {

  }

  public ngOnInit(): void {
    this._processes.processes$
    .pipe(
      switchMap((process) => {
        this.processes.push(process);
        this._cdRef.markForCheck();

        return process.observable$
        .pipe(
          map((data) => {
            return {
              process,
              data,
            }
          })
        );
      })
    )
    .subscribe((event: any) => {
      if(event.data.url) {
        window.location = event.data.url;
      }
    });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

}
