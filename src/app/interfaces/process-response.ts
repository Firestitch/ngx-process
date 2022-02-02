import { FsProcessAction } from './process-action';

export interface IFsProcessResponse {
  [key: string]: unknown;
  _action?: FsProcessAction;
}
