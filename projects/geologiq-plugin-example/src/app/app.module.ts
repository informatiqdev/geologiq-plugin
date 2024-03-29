import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AppLoadingModule } from './shared/loading/app-loading.module';
import { LayoutModule } from './layouts/layout.module';
import { PagesModule } from './pages/pages.module';

import { GeologiqPluginModule } from 'geologiq-plugin';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    HttpClientModule,

    AppLoadingModule,

    BrowserModule,
    AppRoutingModule,

    LayoutModule,
    PagesModule,

    GeologiqPluginModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
