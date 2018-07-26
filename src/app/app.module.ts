import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppIndex } from './app.index';

@NgModule({
  declarations: [
    AppIndex
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppIndex]
})
export class AppModule { }
