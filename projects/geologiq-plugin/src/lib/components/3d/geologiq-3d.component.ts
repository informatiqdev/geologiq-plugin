import { Component, ViewChild, ElementRef, Input } from '@angular/core';

import { GeologiqService } from '../../services/3d/geologiq.service';
import { Tube, Model3D, Point, SurfaceModel } from '../../services/3d';

@Component({
  selector: 'geologiq-3d',
  templateUrl: './geologiq-3d.component.html',
  styleUrls: ['./geologiq-3d.component.scss']
})
export class Geologiq3dComponent {

  @ViewChild('geologiqcontainer')
  private geologiqContainer?: ElementRef;

  @Input() maintainAspectRatio = true;

  constructor(
    private geologiqService: GeologiqService) {
  }

  show() {
    if (!this.geologiqContainer)
      throw new Error('show must be called in AfterViewInit.');

    const canvas = this.geologiqService.canvasElement;
    if (!canvas)
      throw new Error('GeologiQ canvas element not created.');

    const element = this.geologiqContainer.nativeElement;
    element.classList.remove('keep-aspect-ratio', 'follow-parent');
    const className = this.maintainAspectRatio
      ? 'keep-aspect-ratio'
      : 'follow-parent';
    element.classList.add(className);

    // remove the display none style which was added during initializing the unity instance
    canvas.style.display = '';

    element.appendChild(canvas as Node);
    canvas.classList.remove('hidden');
  }

  hide() {
    if (!this.geologiqContainer)
      throw new Error('show must be called in AfterViewInit.');

    const canvas = this.geologiqService.canvasElement;
    if (!canvas)
      throw new Error('GeologiQ canvas element not created.');

    const element = this.geologiqContainer.nativeElement;

    element.remove(canvas as Node);
    canvas.classList.add('hidden');
    element.classList.remove('keep-aspect-ratio', 'follow-parent');
  }

  createView(view: Point) {
    this.geologiqService.send('ContentManager', 'CreateView', view);
  }

  toggleOcean(show: boolean) {
    this.geologiqService.send('ContentManager', show ? 'ShowOcean' : 'HideOcean');
  }

  toggleSeabed(show: boolean) {
    this.geologiqService.send('ContentManager', show ? 'ShowSeabed' : 'HideSeabed');
  }

  drawTube(tube: Tube) {
    this.geologiqService.send('ContentManager', 'DrawTube', tube);
  }

  load3DModel(model: Model3D) {
    this.geologiqService.send('ContentManager', 'Load3DModel', model);
  }

  loadSurface(surface: SurfaceModel) {
    this.geologiqService.send('ContentManager', 'LoadSurface', surface);
  }

  lookAtContent(id: string | string[]) {
    const ids: string[] = id instanceof Array ? id : [id];
    this.geologiqService.send('CameraManager', 'LookAtContent', { content: ids });
  }

  clear() {
    this.geologiqService.send('ContentManager', 'ClearView');
  }
}
