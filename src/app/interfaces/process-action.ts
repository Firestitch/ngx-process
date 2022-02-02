import { FsProcessActionType } from '../enums/process-action';


export type FsProcessAction = IFsProcessUrlAction;

export interface IFsProcessUrlAction {
  type: FsProcessActionType.Download;
  url: any;
  target: string;
}

