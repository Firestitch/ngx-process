import { Observable } from 'rxjs';

import { FsProcessState } from '../enums/process-state';


export interface IProcess {
  name?: string;
  state?: FsProcessState;
  target?: Observable<unknown>;
}
