import { Component } from '@angular/core';

import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { FsProcess } from '@firestitch/package';

import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';


@Component({
  selector: 'kitchen-sink',
  templateUrl: 'kitchen-sink.component.html',
  styleUrls: ['kitchen-sink.component.scss']
})
export class KitchenSinkComponent {

  public config = {};

  constructor(
    private exampleComponent: FsExampleComponent,
    private message: FsMessage,
    private _process: FsProcess,
  ) {
    exampleComponent.setConfigureComponent(KitchenSinkConfigureComponent, { config: this.config });
  }

  public exportAccounts(): void {
    const request = of({
      data: {
        url: 'https://publib.boulder.ibm.com/bpcsamp/v6r1/monitoring/clipsAndTacks/download/ClipsAndTacksF1.zip',
      }
    });

    const process$ = this._process
      .run(
        'Export Accounts',
        request.pipe(delay(4000)),
      );

    process$
      .subscribe(() => {
        console.log('done');
      });

    process$.state$
      .subscribe((state) => {
        console.log('STATE: ', state);
      })
  }

  public dbDrop(): void {
    const request = of({ });

    this._process.run(
      'Drop Database',
      request.pipe(delay(40000)),
    );
  }

  public charge(): void {
    const request = of({ });

    this._process.run(
      'Charge Bank Account',
      request.pipe(delay(2000)),
    );
  }

  public withError(): void {
    const obs$ = new Observable<unknown>((obs) => {
      setTimeout(() => {
        obs.error('Error')
      }, 2000);
    });

    const process$ = this._process.run('Error in 2 sec', obs$);

    process$.subscribe({
      error: (e) => {
        console.log('Error', e)
      }
    });
  }
}
