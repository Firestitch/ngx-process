import { Observable } from 'rxjs';

import { ProcessState } from '../enums/process-state';


export interface IProcess {
  name?: string;
  state?: ProcessState;
  target?: Observable<unknown>;
}
