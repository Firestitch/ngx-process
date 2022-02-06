import { ProcessAction } from '../enums/process-action';

export interface IProcessResponse {
  action: ProcessAction;

}

export interface IProcessResponseNone extends IProcessResponse {

}

export interface IProcessResponseDownload extends IProcessResponse {
  url: string;
}
