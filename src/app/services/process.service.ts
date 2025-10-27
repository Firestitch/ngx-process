import { Injectable, inject } from '@angular/core';

import { Observable } from 'rxjs';

import { ProcessType } from '../enums/process-type';
import { ProcessConfig } from '../interfaces';
import { Process } from '../models/process';

import { FsProcesses } from './processes.service';


@Injectable({
  providedIn: 'root',
})
export class FsProcess {
  private _processes = inject(FsProcesses);


  public setLimit(value) {
    this._processes.setLimit(value);
  }

  public download(name: string, target: Observable<string>, config?: ProcessConfig): Process {
    return this._processes.addProcess({
      name,
      type: ProcessType.Download,
      target,
    }, config);
  }

  public run(name: string, target: Observable<any>, config?: ProcessConfig): Process {
    return this._processes.addProcess({
      name,
      type: ProcessType.Run,
      target,
    }, config);
  }
}
