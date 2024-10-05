import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Subject } from 'rxjs';

import { ProcessState } from '../../enums/process-state';
import { Process } from '../../models/process';


@Component({
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogComponent implements OnDestroy, OnInit {

  public process: Process;
  public ProcessState = ProcessState;

  private _destroy$ = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA)
    private _dialogData: any,
    private _dialogRef: MatDialogRef<LogComponent>,
  ) { }

  public ngOnInit(): void {
    this.process = this._dialogData.process;
  }

  public ngOnDestroy() {
    this._destroy$.next(null);
    this._destroy$.complete();
  }

}
