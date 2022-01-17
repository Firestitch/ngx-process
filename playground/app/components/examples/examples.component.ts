import { Component } from '@angular/core';
import { environment } from '@env';


@Component({
  templateUrl: 'examples.component.html'
})
export class ExamplesComponent {
  public config = environment;
}
