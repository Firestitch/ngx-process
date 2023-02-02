import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsProcesses } from './processes.service';
import { Process } from '../models/process';
import { ProcessType } from '../enums/process-type';
import { ProcessConfig } from '../interfaces';


@Injectable({
  providedIn: 'root',
})
export class FsProcess {

  public constructor(
    private _processes: FsProcesses,
  ) {}

  public download(message: string, target: Observable<string>, config?: ProcessConfig): Process {
    return this._processes.addProcess({
      message,
      type: ProcessType.Download,
      target,
    }, config);
  }

  public run(message: string, target: Observable<any>, config?: ProcessConfig): Process {
    return this._processes.addProcess({
      message,
      type: ProcessType.Run,
      target,
    }, config);
  }
}
