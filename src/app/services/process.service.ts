import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { FsProcesses } from './processes.service';
import { Process } from '../models/process';
import { ProcessType } from '../enums/process-type';


@Injectable({
  providedIn: 'root',
})
export class FsProcess {

  public constructor(
    private _processes: FsProcesses,
  ) {}

  public download(name: string, target: Observable<string>): Process {
    return this._processes.addProcess({
      name,
      type: ProcessType.Download,
      target,
    });
  }

  public run(name: string, target: Observable<any>): Process {
    return this._processes.addProcess({
      name,
      type: ProcessType.Run,
      target,
    });
  }
}
