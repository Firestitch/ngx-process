import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsComponentComponent } from './components/component/component.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    FsComponentComponent,
  ],
  declarations: [
    FsComponentComponent,
  ],
  providers: [
    // FsComponentService,
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
