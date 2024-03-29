import { Component, ViewChild, ElementRef, Inject } from '@angular/core';

import { GeologiqService } from '../../services/3d/geologiq.service';
import { Tube, Model3D, Point, SurfaceModel } from '../../services/3d';
import { Ocean } from '../../services/render';
import { DOCUMENT } from '@angular/common';


@Component({
  // tslint:disable-next-line:component-selector
  selector: 'geologiq-3d',
  templateUrl: './geologiq-3d.component.html',
  styleUrls: ['./geologiq-3d.component.scss']
})
export class Geologiq3dComponent {

  @ViewChild('geologiqcontainer')
  private geologiqContainer?: ElementRef;

  private maintainAspectRatio = false;

  private document: Document;

  constructor(
    private geologiqService: GeologiqService,
    @Inject(DOCUMENT) document: any) {
    this.document = document;
    this.maintainAspectRatio = this.geologiqService.config?.maintainAspectRatio === true;
  }

  show(): void {
    if (!this.geologiqContainer) {
      throw new Error('show must be called in AfterViewInit.');
    }

    const canvas = this.geologiqService.canvasElement;
    if (!canvas) {
      throw new Error('GeologiQ canvas element not created.');
    }

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

  hide(): void {
    if (!this.geologiqContainer) {
      throw new Error('show must be called in AfterViewInit.');
    }

    const canvas = this.geologiqService.canvasElement;
    if (!canvas) {
      throw new Error('GeologiQ canvas element not created.');
    }

    const element = this.geologiqContainer.nativeElement;

    element.remove(canvas as Node);
    canvas.classList.add('hidden');
    element.classList.remove('keep-aspect-ratio', 'follow-parent');

    canvas.style.display = 'none';
    this.document.body.appendChild(canvas as Node);
  }

  createView(view: Point): void {
    this.geologiqService.send('ContentManager', 'CreateView', view);
  }

  toggleOcean(show: boolean): void {
    this.geologiqService.send('ContentManager', show ? 'ShowOcean' : 'HideOcean');
  }

  defineOcean(ocean: Ocean): void {
    this.geologiqService.send('ContentManager', 'DefineOcean', ocean);
  }

  toggleSeabed(show: boolean): void {
    this.geologiqService.send('ContentManager', show ? 'ShowSeabed' : 'HideSeabed');
  }

  drawTube(tube: Tube): void {
    this.geologiqService.send('ContentManager', 'DrawTube', tube);
  }

  load3DModel(model: Model3D): void {
    this.geologiqService.send('ContentManager', 'Load3DModel', model);
  }

  loadSurface(surface: SurfaceModel): void {
    this.geologiqService.send('ContentManager', 'LoadSurface', surface);
  }

  lookAtContent(id: string | string[]): void {
    const ids: string[] = id instanceof Array ? id : [id];
    this.geologiqService.send('CameraManager', 'LookAtContent', { content: ids });
  }

  highlightElement(id: string | string[]): void {
    const ids: string[] = id instanceof Array ? id : [id];
    this.geologiqService.send('ContentManager', 'Highlight', { content: ids });
  }

  toggleElement(id: string | string[], show: boolean): void {
    this.geologiqService.send('ContentManager', show ? 'ShowContent' : 'HideContent', id);
  }

  removeAllHighlights(): void {
    this.geologiqService.send('ContentManager', 'RemoveAllHighlights');
  }

  lookEast(): void {
    this.geologiqService.send('CameraManager', 'LookEast');
  }

  lookWest(): void {
    this.geologiqService.send('CameraManager', 'LookWest');
  }

  lookNorth(): void {
    this.geologiqService.send('CameraManager', 'LookNorth');
  }

  lookSouth(): void {
    this.geologiqService.send('CameraManager', 'LookSouth');
  }

  frameAllContent(): void {
    this.geologiqService.send('CameraManager', 'FrameAllContent');
  }

  clear(): void {
    this.geologiqService.send('ContentManager', 'ClearView');
  }
}
