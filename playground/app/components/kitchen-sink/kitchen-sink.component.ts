import { ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';

import { FsApi, RequestMethod, StreamEventComplete, StreamEventData } from '@firestitch/api';
import { FsProcess } from '@firestitch/package';

import { Observable, of, Subject, throwError, timer } from 'rxjs';
import { catchError, delay, map, takeUntil, tap } from 'rxjs/operators';

import { TEST_URL } from 'playground/app/injectors';


@Component({
  selector: 'kitchen-sink',
  templateUrl: './kitchen-sink.component.html',
  styleUrls: ['./kitchen-sink.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KitchenSinkComponent implements OnDestroy {

  public config = {};

  private _destroy$ = new Subject();

  constructor(
    @Inject(TEST_URL) private _url: string,
    private _process: FsProcess,
    private _api: FsApi,
  ) {
  }

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

  public apiStreamError(): void {
    this.apiStream('Something bad happened');
  }

  public apiStream(exception?): void {
    const subject = new Subject();

    this._api.stream(
      RequestMethod.Post, `${this._url}/stream`,
      { 
        count: 20, 
        sleep: .25,
        exception,
      },
    )
      .pipe(
        tap((event) => {
          if(event instanceof StreamEventData) {
            process.message = event.data.word;
          }
   
          if(event instanceof StreamEventComplete) {
            process.message = 'Completed process';
          }
        }),
        catchError((error) => {
          subject.error(error);

          return throwError(error);
        }),
      )
      .subscribe({
        complete: () => {
          subject.next();
          subject.complete();
        },
      });

    const process = this._process.run(
      'API Streaming',
      subject.asObservable(),
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
    this._process.run(
      'API Keep Alive Error',
      this._api.get(`${this._url}?keepAlive=3`),
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
