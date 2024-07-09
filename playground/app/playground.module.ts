import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { FsApiModule } from '@firestitch/api';
import { FsExampleModule } from '@firestitch/example';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsProcessModule } from '@firestitch/package';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { AppComponent } from './app.component';
import {
  ExamplesComponent,
  KitchenSinkComponent,
} from './components';
import { KitchenSinkConfigureComponent } from './components/kitchen-sink-configure';
import { TEST_URL } from './injectors';
import { AppMaterialModule } from './material.module';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    BrowserModule,
    FsProcessModule,
    BrowserAnimationsModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsExampleModule.forRoot(),
    FsApiModule.forRoot(),
    FsMessageModule.forRoot(),
    RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' }),
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    KitchenSinkComponent,
    KitchenSinkConfigureComponent,
  ],
  providers: [
    { provide: TEST_URL, 
      useFactory: () => {
        return document.location.hostname === 'localhost' ? 
          'https://specify.local.firestitch.com/api/dummy' :
          'https://specify.firestitch.dev/api/dummy';
      }, 
    },
  ],
})
export class PlaygroundModule {
}
