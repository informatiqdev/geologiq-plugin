import { NgModule, ModuleWithProviders } from '@angular/core';

import { GeologiqService } from './services/3d/geologiq.service';
import { Geologiq3dComponent } from './components/3d/geologiq-3d.component';
import { GeologiqPluginComponent } from './components/render/geologiq-plugin.component';

@NgModule({
  declarations: [
    GeologiqPluginComponent,
    Geologiq3dComponent
  ],
  imports: [
  ],
  exports: [
    GeologiqPluginComponent,
    // Geologiq3dComponent
  ]
})
export class GeologiqPluginModule {

  static forRoot(): ModuleWithProviders<GeologiqPluginModule> {
    return {
      ngModule: GeologiqPluginModule,
      providers: [
        GeologiqService
      ]
    };
  }
}
