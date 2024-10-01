import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

import { FsProcessDockComponent } from './components/dock';
import { LogComponent } from './components/log';

@NgModule({
  imports: [
    CommonModule,

    MatDialogModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  declarations: [
    FsProcessDockComponent,
    LogComponent,
  ],
})
export class FsProcessModule { }
