import { Component, ViewChild, ElementRef } from '@angular/core';

import { GeologiqService } from '../services/geologiq.service';
import { Tube, Model3D, Point } from '../models';

@Component({
  selector: 'geologiq-plugin',
  templateUrl: './geologiq-plugin.component.html',
  styleUrls: ['./geologiq-plugin.component.scss']
})
export class GeologiqPluginComponent {

  @ViewChild('geologiqcontainer')
  private _geologiqContainer?: ElementRef;

  constructor(  
    private _geologiqService: GeologiqService) {
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

  createView(view: Point) {
    this._geologiqService.send('GeologiQ', 'CreateView', view);
  }

  toggleOcean(show: boolean) {
    this._geologiqService.send('GeologiQ', show ? 'ShowOcean' : 'HideOcean');
  }

  toggleSeabed(show: boolean) {
    this._geologiqService.send('GeologiQ', show ? 'ShowSeabed' : 'HideSeabed');
  }

  drawTube(tube: Tube) {
    this._geologiqService.send('GeologiQ', 'DrawTube', tube);
  }

  load3DModel(model: Model3D) {
    this._geologiqService.send('GeologiQ', 'Load3DModel', model);
  }
}
