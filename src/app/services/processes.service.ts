import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Observable, Subject } from 'rxjs';
import { FsProcessDockComponent } from '../components/dock/dock.component';
import { Process } from '../interfaces/process';


@Injectable({
  providedIn: 'root',
})
export class FsProcesses {

  private _processes$ = new Subject<Process>();

  public constructor(
   
  ) {}

  public get processes$(){
    return this._processes$;
  }

  public addProcess(process) {
    this._processes$.next(process);
  }

}
