import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit, inject } from '@angular/core';

import { CdkScrollable } from '@angular/cdk/scrolling';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

import { FsChipModule } from '@firestitch/chip';

import { Subject } from 'rxjs';

import { ProcessState } from '../../enums/process-state';
import { Process } from '../../models/process';


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
    FsChipModule,
  ],
})
export class LogComponent implements OnDestroy, OnInit {

  public process: Process;
  public ProcessState = ProcessState;

  private _destroy$ = new Subject<void>();
  private _dialogData = inject(MAT_DIALOG_DATA);

  public ngOnInit(): void {
    this.process = this._dialogData.process;
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
