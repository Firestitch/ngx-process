import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { ProcessState } from '../../enums/process-state';
import { Process } from '../../models/process';
import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatButton } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';


@Component({
    templateUrl: './log.component.html',
    styleUrls: ['./log.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        MatDialogTitle,
        CdkScrollable,
        MatDialogContent,
        MatProgressSpinner,
        MatDialogActions,
        MatButton,
        MatDialogClose,
        AsyncPipe,
    ],
})
export class LogComponent implements OnDestroy, OnInit {
  private _dialogData = inject(MAT_DIALOG_DATA);
  private _dialogRef = inject<MatDialogRef<LogComponent>>(MatDialogRef);


  public process: Process;
  public ProcessState = ProcessState;

  private _destroy$ = new Subject<void>();

  public ngOnInit(): void {
    this.process = this._dialogData.process;
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
