import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FsProcessActionType } from '../enums/process-action';
import { IFsProcessResponse } from '../interfaces/process-response';

@Injectable({
  providedIn: 'root',
})
export class FsProcessActionController {

  constructor(
    @Inject(DOCUMENT)
    private _DOCUMENT: Document,
  ) {}

  private get _window(): Window {
    return this._DOCUMENT.defaultView;
  }

  public perform(response: IFsProcessResponse): void {
    const action = response._action;

    switch (action.type) {
      case FsProcessActionType.Download: {
        this._window.open(action.url, '_blank');
      } break;
    }
  }

}
