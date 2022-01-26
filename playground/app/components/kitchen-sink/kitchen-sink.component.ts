import { Component } from '@angular/core';
import { KitchenSinkConfigureComponent } from '../kitchen-sink-configure';
import { FsExampleComponent } from '@firestitch/example';
import { FsMessage } from '@firestitch/message';
import { FsProcess } from '@firestitch/package';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
    const request = of({ url: 'https://publib.boulder.ibm.com/bpcsamp/v6r1/monitoring/clipsAndTacks/download/ClipsAndTacksF1.zip' });

    this._process.run(
      'Export Accounts',
      request.pipe(delay(4000)),
    );
  }

  public dbDrop(): void {
    const request = of({ url: 'https://publib.boulder.ibm.com/bpcsamp/v6r1/monitoring/clipsAndTacks/download/ClipsAndTacksF1.zip' });

    this._process.run(
      'Drop Database',
      request.pipe(delay(40000)),
    );
  }

  public charge(): void {
    const request = of({ url: 'https://publib.boulder.ibm.com/bpcsamp/v6r1/monitoring/clipsAndTacks/download/ClipsAndTacksF1.zip' });

    this._process.run(
      'Charge Bank Account',
      request.pipe(delay(7000)),
    );
  }
}
