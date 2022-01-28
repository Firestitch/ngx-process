import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { FsProcessDockComponent } from './components/dock/dock.component';

@NgModule({
  imports: [
    CommonModule,

    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
  ],
  exports: [],
  declarations: [
    FsProcessDockComponent,
  ],
})
export class FsProcessModule {}
