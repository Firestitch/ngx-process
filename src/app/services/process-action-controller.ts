import { Injectable } from '@angular/core';
import { ProcessAction } from '../enums/process-action';
import { IProcessResponseDownload, IProcessResponseNone } from '../interfaces/process-response';


@Injectable({
  providedIn: 'root',
})
export class FsProcessActionController {

  public perform(response: IProcessResponseNone | IProcessResponseDownload): void {
    switch (response.action) {
      case ProcessAction.Download: {
        (window as any).location = (response as IProcessResponseDownload).url;
      } break;
    }
  }

}
