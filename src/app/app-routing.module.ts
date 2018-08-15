import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutUsComponent } from './about-us/about-us.component';
import { IndexComponent } from './index/index.component';
import { DataComponent } from './data/data.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CompanyComponent } from './company/company.component';

const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'data', component: DataComponent },
  { path: "company/:id", component: CompanyComponent },
  { path: "**", component: NotFoundComponent }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }