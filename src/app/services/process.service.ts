import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { ProcessType } from '../enums/process-type';
import { ProcessConfig } from '../interfaces';
import { Process } from '../models/process';

import { FsProcesses } from './processes.service';


@Injectable({
  providedIn: 'root',
})
export class FsProcess {

  constructor(
    private _processes: FsProcesses,
  ) { }

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
