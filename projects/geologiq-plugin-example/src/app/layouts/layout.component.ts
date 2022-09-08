import { Subject } from 'rxjs';
import { tap, takeUntil} from 'rxjs/operators';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-default-layout',
    templateUrl: './layout.component.html',
    encapsulation: ViewEncapsulation.None
  })
  export class LayoutComponent {
    constructor() {
    }
  }
