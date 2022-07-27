import { DOCUMENT } from '@angular/common';
import { Observable, Subject, BehaviorSubject } from 'rxjs';
import { filter, first, switchMap, takeUntil } from 'rxjs/operators';
import { Injectable, Inject, NgZone, OnDestroy } from '@angular/core';

import { GeologiqConfig } from '../../config/geologiq-config';

/**
 * Unity Javascript interface
 */
export declare function createUnityInstance(elementId: Element, config: Object, progress: (n: number) => void): Promise<UnityInstance>;

export declare class UnityInstance {
  constructor();

  SetFullscreen(fullscreen: number): void;
  SendMessage(gameObjectName: string, methodName: string, parameter?: any): void;
}

/**
 * GeologiQ service
 */
@Injectable({
  providedIn: 'root'
})
export class GeologiqService implements OnDestroy {

  private destroy$ = new Subject<boolean>();

  private loaded = false;

  private unityActivated = new BehaviorSubject<boolean>(false);

  activated$ = this.unityActivated.pipe(
    filter(active => true === active)
  );

  private canvas?: HTMLCanvasElement;
  private unityInstance?: UnityInstance;

  private _document: Document;

  constructor(
    private zone: NgZone,
    @Inject(DOCUMENT) document: any) {
      this._document = document;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  /**
   * Injects Unity3D loader script to page and loads script for remote URL
   * @param source Script source URL
   */
  private loadScript(source: string): Observable<Event> {
    return new Observable(observer => {
      const unityLoaderScript = this._document.createElement('script');
      unityLoaderScript.type = 'text/javascript';
      unityLoaderScript.async = true;
      unityLoaderScript.src = source;
      unityLoaderScript.onload = (e) => {
        observer.next(e);
      };

      const head = this._document.getElementsByTagName('head')[0];
      head.appendChild(unityLoaderScript);
    });
  }

  /**
   * Initializes HTML canvas element with GeologiQ 3D engine
   * @param elementId Canvas element ID
   * @param opts Geolg
   * @param onProgress
   */
  private async load(elementId: string, opts: GeologiqConfig, onProgress?: (number: number) => void) {
    this.loadScript(opts.loaderUrl).pipe(
      switchMap(async () => {
        const config = {
          ...opts,
          showBanner: (msg: string, type: any) => {
            console.error('GeologiQ failed to load: ', { type, msg });
          }
        };

        this.canvas = this._document.createElement('canvas');
        this.canvas.id = elementId;
        this.canvas.classList.add("geologiq-3d", "hidden");

        // Default Unity3D canvas size      
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.width  = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;

        // NOTE: temporariliy attach the canvas to the document because in the latest unity version, it tries to add event listener
        // to its parent document which fails if it is not attached to the document
        this._document.body.append(this.canvas);

        // Create new Unity 3D engine instance
        this.unityInstance = await createUnityInstance(this.canvas, config, (progress: number): void => {
          if (onProgress)
            onProgress(progress);
        });

        // detach the camvas
        this._document.body.removeChild(this.canvas); 

        // Indicate that Unity3D Engine is loaded
        this.loaded = true;

        // Indicate that Unity3D Engine is activated
        this.unityActivated.next(true);
      }),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  /**
   * Indicates whether Unity3D engine is loaded or not
   * @returns True if Unity3D engine is loaded
   */
  isLoaded(): boolean {
    return this.unityInstance !== null && this.loaded;
  }

  /**
   * Initialize GeologiQ 3D plugin
   * @param elementId HTML canvas element identifier
   * @param opts GeologiQ plugin configuration
   * @param onLoaded Callback when GeologiQ 3D engine has been loaded
   * @param onProgress Callback indicating progress of GeologiQ 3D engine loading process
   */
  init(elementId: string, opts: GeologiqConfig, onLoaded?: () => void, onProgress?: (number: number) => void) {
    const config: GeologiqConfig = {
      ...opts,
      loaderUrl: opts.loaderUrl.replace('[version]', opts.productVersion),
      dataUrl: opts.dataUrl.replace('[version]', opts.productVersion),
      frameworkUrl: opts.frameworkUrl.replace('[version]', opts.productVersion),
      codeUrl: opts.codeUrl.replace('[version]', opts.productVersion),
      onRuntimeInitialized: () => {
        if (onLoaded)
          onLoaded();
      }
    };

    this.zone.onStable.pipe(
      first(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      // If Unity instance has not been loaded before, then load the Unity engine
      if (!this.unityInstance) {
        this.zone.runOutsideAngular(() => {
          this.load(elementId, config, onProgress);
        });
      } else {
        if (this.unityInstance)
          this.unityActivated.next(true);
      }
    });
  }

  /**
   * GeologiQ 3D engine HTML canvas element reference
   */
  get canvasElement(): HTMLCanvasElement | null {
    return this.canvas ?? null;
  }

  /**
   * Toggle fullscreen mode
   * @param fullscreen Enable (true) or disable (false) fullscreen mode
   */
  toggleFullscreen(fullscreen: boolean): void {
    if (!this.isLoaded())
      return;

    this.zone.runOutsideAngular(() => {
      this.unityInstance?.SetFullscreen(fullscreen === true ? 1 : 0);
    });
  }

  /**
   * Send command to GeologiQ 3D engine
   * @param objectName 3D engine API object name
   * @param methodName 3D engine API object method name
   * @param parameter  3D engine API object method parameters
   */
  send(objectName: string, methodName: string, parameter?: any): void {
    this.zone.runOutsideAngular(() => {
      if (!this.unityInstance || !this.isLoaded())
        throw new Error("send() cannot be called before GeologiQ 3D engine has been loaded.");

      if (!parameter) {
        this.unityInstance.SendMessage(objectName, methodName);
      } else {
        this.unityInstance.SendMessage(objectName, methodName, JSON.stringify(parameter));
      }
    });
  }
}
