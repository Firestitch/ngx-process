import { UploadService } from './../../services/upload.service';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { Subject, interval } from 'rxjs';
import { takeUntil, debounceTime } from 'rxjs/operators';

import { UploadFileStatus } from '../../enums/upload-file-status';
import { UploadFile } from './../../classes/file';

@Component({
  templateUrl: 'dock.component.html',
  styleUrls: ['dock.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FsProcessDockComponent implements OnDestroy {

  public files: UploadFile[] = [];
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
  public UploadFileStatus = UploadFileStatus;
  public bytesPerSecond: number[] = [];

  private _destroy$ = new Subject<void>();

  constructor(
    private _dialogRef: MatDialogRef<FsUploadComponent>,
    private _uploadService: UploadService,
    private _cdRef: ChangeDetectorRef,
  ) {
    this._addFiles(this._uploadService.files);
    this._uploadService.filesAdded$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(files => {
        this._addFiles(files);
      });

      interval(1000)
        .pipe(
          takeUntil(this._destroy$)
        )
        .subscribe(() => {
          if (this.uploading) {
            this._calcRemaning();
            this._cdRef.markForCheck();
          }

          if (this.closingSeconds !== null) {
            this.closingSeconds--;
            this._cdRef.markForCheck();

            if (this.closingSeconds <= 0) {
              this._clearClosing();
              this._dialogRef.close();
            }
          }
        });
  }

  public ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }

  public cancel(file) {
    file.cancel();
    this._update();
  }

  private _addFiles(files) {
    this.files.push(...files);

    this.uploadTotalBytes += files.reduce((total, file) => {
      return total + file.file.size;
    }, 0);

    this._clearClosing();
    files.forEach((file: UploadFile) => {
      this._processFile(file);
    });
    this._cdRef.markForCheck();
  }

  private _calcRemaning() {
    const bytesPerSecond = this.bytesPerSecond.reduce((total, value) => {
      return total + value;
    }, 0);

    const avgBytesPerSecond = bytesPerSecond / this.bytesPerSecond.length;

    const bytes = this.uploadTotalBytes - this.uploadLoadedBytes;

    this.remainingSeconds = Math.floor(bytes / avgBytesPerSecond);
  }

  private _processFile(file: UploadFile) {
    file.statusSubject
      .pipe(
        takeUntil(this._destroy$),
        debounceTime(500)
      )
      .subscribe(status => {
        this._update();
      });
  }

  private _update() {

    let uploading = 0;
    let uploaded = 0;
    let processing = 0;
    let failed = 0;
    let cancelled = 0;
    let queued = 0;
    let uploadLoadedBytes = 0;

    this.files.forEach((file: UploadFile) => {
      uploadLoadedBytes += file.loaded;
      switch (file.status) {
        case UploadFileStatus.Uploading:
          if (file.bytesPerSecond) {
            this.bytesPerSecond.unshift(file.bytesPerSecond);
          }
          uploading++;
          break;
        case UploadFileStatus.Processing:
          processing++;
          break;
        case UploadFileStatus.Uploaded:
          uploaded++;
          break;
        case UploadFileStatus.Cancelled:
          cancelled++;
          break;
        case UploadFileStatus.Failed:
          failed++;
          break;
        case UploadFileStatus.Queued:
          queued++;
          break;
      }
    });

    this.uploading = uploading;
    this.uploaded = uploaded;
    this.processing = processing;
    this.failed = failed;
    this.cancelled = cancelled;
    this.queued = queued;
    this.uploadLoadedBytes = uploadLoadedBytes;
    this.bytesPerSecond = this.bytesPerSecond.splice(0, 50);

    if (!this.uploading && !this.processing && !this.queued) {
      const timeout = this.failed ? this.closingTimeout : 0;
      this._startClosing(timeout);
      this.remainingSeconds = 0;
    }

    this._cdRef.markForCheck();
  }

  private _clearClosing() {
    this.closingSeconds = null;
  }

  private _startClosing(closingTimeout) {
    this.closingSeconds = closingTimeout;
  }
}
