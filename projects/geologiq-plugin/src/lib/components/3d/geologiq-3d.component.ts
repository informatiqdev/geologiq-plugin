import { Component, ViewChild, ElementRef } from '@angular/core';

import { GeologiqService } from '../../services/3d/geologiq.service';
import { Tube, Model3D, Point } from '../../services/3d';

@Component({
  selector: 'geologiq-3d',
  templateUrl: './geologiq-3d.component.html',
  styleUrls: ['./geologiq-3d.component.scss']
})
export class Geologiq3dComponent {

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
    this._geologiqService.send('Content', 'CreateView', view);
  }

  toggleOcean(show: boolean) {
    this._geologiqService.send('Content', show ? 'ShowOcean' : 'HideOcean');
  }

  toggleSeabed(show: boolean) {
    this._geologiqService.send('Content', show ? 'ShowSeabed' : 'HideSeabed');
  }

  drawTube(tube: Tube) {
    this._geologiqService.send('Content', 'DrawTube', tube);
  }

  load3DModel(model: Model3D) {
    this._geologiqService.send('Content', 'Load3DModel', model);
  }

  clear() {
    this._geologiqService.send('Content', 'ClearView');
  }
}
