import { Component, Inject } from '@angular/core';
import { DrawerRef, DRAWER_DATA } from '@firestitch/drawer';
import { ExampleService } from '@firestitch/example';


@Component({
  templateUrl: './kitchen-sink-configure.component.html',
  styleUrls: ['./kitchen-sink-configure.component.scss']
})
export class KitchenSinkConfigureComponent {

  public config;
  public example: ExampleService;

  constructor(public drawer: DrawerRef<KitchenSinkConfigureComponent>,
              @Inject(DRAWER_DATA) public data) {
    this.config = data.config;
    this.example = data.example;
  }

  reload() {
    this.data.example.reload();
  }
}
