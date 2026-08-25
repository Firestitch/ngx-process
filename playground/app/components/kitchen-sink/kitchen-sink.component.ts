import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';

import { FsApi, RequestMethod, StreamEventData } from '@firestitch/api';
import { FsProcess } from '@firestitch/package';

import { Observable, of, Subject, timer } from 'rxjs';
import { delay, map, takeUntil } from 'rxjs/operators';

import { TEST_URL } from 'playground/app/injectors';
import { MatButton } from '@angular/material/button';


@Component({
    selector: 'kitchen-sink',
    templateUrl: './kitchen-sink.component.html',
    styleUrls: ['./kitchen-sink.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [MatButton],
})
export class KitchenSinkComponent implements OnDestroy {
  private _url = inject(TEST_URL);
  private _process = inject(FsProcess);
  private _api = inject(FsApi);


  public config = {};

  private _destroy$ = new Subject();

  public exportAccounts(): void {
    const request = of({
      url: 'https://publib.boulder.ibm.com/bpcsamp/v6r1/monitoring/clipsAndTacks/download/ClipsAndTacksF1.zip',
    })
      .pipe(
        delay(5000),
        map((data: any) => {
          return data.url;
        }),
      );

    const process = this._process
      .download(
        'Export Accounts',
        request,
      );

    timer(1000, 1000)
      .pipe(
        takeUntil(process.completed$),
      )
      .subscribe(() => {
        process.message = `${process.message || ''}.`;
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

  public apiStreamError(): void {
    this.apiStream('Something bad happened');
  }

  public apiStream(exception?): void {

    const subject = this._api.stream(
      RequestMethod.Post, `${this._url}/stream`,
      { 
        count: 20, 
        sleep: .25,
        exception,
      },
    )
      .pipe(
        map((event) => {
          if(event instanceof StreamEventData) {
            return event.data.word;
          }

          return '';
        }),
      );

    const process = this._process.run(
      'API Streaming',
      subject,
    );
  }

  public apiError(): void {
    this._process.run(
      'API Error',
      this._api.get(`${this._url}?exception=There was an error`),
    );
  }

  public apiSuccess(): void {
    this._process.run(
      'API Success',
      this._api.get(this._url),
    );
  }

  public apiKeepAliveError(): void {
    // Keep alive on its own answers 200 — the error the example is named for
    // only happens when the request is also told to throw
    this._process.run(
      'API Keep Alive Error',
      this._api.get(`${this._url}?keepAlive=3&exception=There was an error`),
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
    this._destroy$.next(null);
    this._destroy$.complete();
  }
}
