import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AppComponent } from './app.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { AppRoutingModule } from './/app-routing.module';
import { IndexComponent } from './index/index.component';
import { DataComponent } from './data/data.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';
import { NotFoundComponent } from './not-found/not-found.component';
import { CompanyComponent } from './company/company.component';

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    IndexComponent,
    DataComponent,
    NotFoundComponent,
    CompanyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpModule,
    HttpClientModule,
    InfiniteScrollModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
