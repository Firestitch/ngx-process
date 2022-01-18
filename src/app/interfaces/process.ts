import { Observable } from "rxjs";
import { ProcessState } from "../enums";

export interface Process {
  name?: string;
  state?: ProcessState;
  observable$?: Observable<any>;
}