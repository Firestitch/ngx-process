import { Component, OnDestroy } from '@angular/core';

import { FsApi } from '@firestitch/api';
import { FsProcess } from '@firestitch/package';

import { Observable, of, Subject, timer } from 'rxjs';
import { delay, map, takeUntil } from 'rxjs/operators';


@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.scss'],
})
export class KitchenSinkComponent implements OnDestroy {

  public config = {};

  private _destroy$ = new Subject();


  constructor(
    private _process: FsProcess,
    private _api: FsApi,
  ) {
  }

  public exportAccounts(): void {
    const request = of({
      url: 'https://publib.boulder.ibm.com/bpcsamp/v6r1/monitoring/clipsAndTacks/download/ClipsAndTacksF1.zip',
    });

    const process = this._process
      .download(
        'Export Accounts',
        request
          .pipe(
            delay(5000),
            map((data: any) => {
              return data.url;
            }),
          ),
        { disableWindow: true },
      );

    timer(1000, 1000)
      .pipe(
        takeUntil(process.completed$),
      )
      .subscribe(() => {
        process.message = `${process.message}.`;
      });

    process
      .completed$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe(() => {
        console.log('Completed');
      });

    process.state$
      .pipe(
        takeUntil(this._destroy$),
      )
      .subscribe((state) => {
        console.log('State: ', state);
      });
  }

  public dbDrop(): void {
    const request = of({});

    this._process.run(
      'Drop Database',
      request.pipe(
        delay(10000),
      ),
    );
  }

  public charge(): void {
    const request = of({});

    this._process.run(
      'Charge Bank Account',
      request.pipe(
        delay(2000),
      ),
    );
  }

  public apiError(): void {
    this._process.run(
      'Api Error',
      this._api.get('https://specify.local.firestitch.com/api/dummy?exception=There was an error'),
    );
  }


  public withError(): void {
    const obs$ = new Observable<unknown>((obs) => {
      setTimeout(() => {
        obs.error('Error');
      }, 2000);
    });

    const process$ = this._process.run('Error in 2 sec', obs$);

    process$.subscribe({
      error: (e) => {
        console.log('Error', e);
      },
    });
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
