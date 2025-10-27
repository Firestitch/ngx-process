import { Component, inject } from '@angular/core';
import { DrawerRef, DRAWER_DATA } from '@firestitch/drawer';
import { ExampleService } from '@firestitch/example';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';


@Component({
    templateUrl: './kitchen-sink-configure.component.html',
    styleUrls: ['./kitchen-sink-configure.component.scss'],
    standalone: true,
    imports: [MatFormField, MatInput, FormsModule, MatButton]
})
export class KitchenSinkConfigureComponent {
  drawer = inject<DrawerRef<KitchenSinkConfigureComponent>>(DrawerRef);
  data = inject(DRAWER_DATA);


  public config;
  public example: ExampleService;

  constructor() {
    const data = this.data;

    this.config = data.config;
    this.example = data.example;
  }

  reload() {
    this.data.example.reload();
  }
}
