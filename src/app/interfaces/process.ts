import { Observable } from 'rxjs';

import { ProcessState } from '../enums/process-state';
import { ProcessType } from '../enums/process-type';

export interface IProcess {
  name: string;
  state?: ProcessState;
  type: ProcessType,
  target: Observable<unknown>;
}
