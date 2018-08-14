import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment.prod';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Company } from '../models/company';
import { CompaniesResult } from '../models/companies-result';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: []
})
export class DataComponent implements OnInit {
  private _nextWcfUrl: string = "";

  private _companiesTotalCount: number = 0;
  public get CompaniesTotalCount(): number {
    return this._companiesTotalCount;
  }

  private _companies: Company[] = [];
  public get Companies(): Company[] {
    return this._companies || [];
  }

  constructor(private titleService: Title, private router: Router, private route: ActivatedRoute,
    private http: HttpClient) {
    this.titleService.setTitle("UrBaseInfo -  Поиск юридических лиц");

    this._nextWcfUrl = environment.apiHost + "/companies";
    if (this.route.queryParams["query"]) {
      this._nextWcfUrl += "?query=" + this.route.queryParams["query"];
    }
    this.loadData(this._nextWcfUrl);
  }

  ngOnInit() {
  }

  public onScroll(): void {
    this.loadData(this._nextWcfUrl);
  }

  private loadData(wcfUrl: string): void {
    this.http.get<CompaniesResult>(wcfUrl).subscribe(data => {
      this._companiesTotalCount = data.count;
      this._companies = this._companies.concat(data.results);
      this._nextWcfUrl = data.next;
    });
  }
}
