import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable } from 'rxjs';

import { FsProcesses } from './processes.service';
import { Process } from '../models/process';
import { IProcessResponse } from '../interfaces/process-response';


@Injectable({
  providedIn: 'root',
})
export class FsProcess {

  public constructor(
    private _dialog: MatDialog,
    private _overlay: Overlay,
    private _processes: FsProcesses,
  ) {}

  public run(name: string, target: Observable<IProcessResponse>): Process {
    return this._processes.addProcess({
      name,
      target,
    });
  }
}
