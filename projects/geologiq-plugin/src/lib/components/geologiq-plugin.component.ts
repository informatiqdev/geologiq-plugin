import { Component, ViewChild, OnInit, OnDestroy, ElementRef } from '@angular/core';

import { GeologiqService } from '../services/geologiq.service';

@Component({
  selector: 'geologiq-plugin',
  templateUrl: './geologiq-plugin.component.html',
  styleUrls: ['./geologiq-plugin.component.scss']
})
export class GeologiqPluginComponent implements OnInit, OnDestroy {

  @ViewChild('geologiqcontainer')
  private _geologiqContainer?: ElementRef;

  constructor(  
    private _geologiqService: GeologiqService) {
  }

  ngOnInit() {
    console.debug('GeologiQ plugin component is loaded.');
  }

  ngOnDestroy() {
    console.debug('GeologiQ plugin component is destroyed.');
  }

  show() {
    if (!this._geologiqContainer)
      throw new Error('show must be called in AfterViewInit.');

    const canvas = this._geologiqService.canvasElement;
    if (!canvas)
      throw new Error('GeologiQ canvas element not created.');

    this._geologiqContainer.nativeElement.appendChild(canvas as Node);
    canvas.classList.remove('hidden');
  } 

  hide() {
    if (!this._geologiqContainer)
      throw new Error('show must be called in AfterViewInit.');

    const canvas = this._geologiqService.canvasElement;
    if (!canvas)
      throw new Error('GeologiQ canvas element not created.');

    this._geologiqContainer.nativeElement.remove(canvas as Node);
    canvas.classList.add('hidden');
  }
}
