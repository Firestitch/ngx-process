import { Overlay } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { merge, Observable, Subject } from 'rxjs';
import { FsProcessDockComponent } from '../components/dock/dock.component';
import { FsProcesses } from './processes.service';


@Injectable({
  providedIn: 'root',
})
export class FsProcess {

  public constructor(
    private _dialog: MatDialog,
    private _overlay: Overlay,
    private _processes: FsProcesses,
  ) {}

  public process(name: string, observable$: Observable<any>) {
    this._dialog.open(FsProcessDockComponent, {
      width: '450px',
      hasBackdrop: false,
      panelClass: 'fs-process-pane',
      position: { bottom: '20px', right: '20px' },
      disableClose: true,
      scrollStrategy: this._overlay.scrollStrategies.noop(),
    })
    .afterOpened()
    .subscribe(() => {
      this._processes.addProcess({ name, observable$ });
    });

  }
}
