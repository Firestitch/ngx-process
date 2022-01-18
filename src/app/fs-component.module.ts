import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsComponentComponent } from './components/component/component.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FsProcessDockComponent } from './components/dock/dock.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    CommonModule,

    MatDialogModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    FsComponentComponent,
  ],
  declarations: [
    FsComponentComponent,
    FsProcessDockComponent,
  ],
})
export class FsComponentModule {
  static forRoot(): ModuleWithProviders<FsComponentModule> {
    return {
      ngModule: FsComponentModule,
      // providers: [FsComponentService]
    };
  }
}
