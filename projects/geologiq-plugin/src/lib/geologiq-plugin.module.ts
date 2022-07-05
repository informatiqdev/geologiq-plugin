import { NgModule, ModuleWithProviders, Optional, SkipSelf } from '@angular/core';

import { GeologiqService } from './services/geologiq.service';
import { GeologiqPluginComponent } from './components/geologiq-plugin.component';

@NgModule({
  declarations: [
    GeologiqPluginComponent
  ],
  imports: [
  ],
  exports: [
    GeologiqPluginComponent
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

 /* constructor(@Optional() @SkipSelf() parentModule: GeologiqPluginModule) {
    if (parentModule) {
      throw new Error('GeologiqPluginModule is already loaded. Import it in the root module only.');
    }
  }*/

}
