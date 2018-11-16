import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from '../../environments/environment.prod';
import { Router, Route, ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Company } from '../models/company';
import { CompaniesResult } from '../models/companies-result';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { OkvedsResult } from '../models/okveds-result';
import { DictionaryItem } from '../models/dictionare-item';
import { RegionsResult } from '../models/regions-result';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: []
})
export class DataComponent implements OnInit {
  private _nextWcfUrl: string = "";

  private _isLoading: boolean = true;
  public get IsLoading(): boolean {
    return this._isLoading;
  }

  private _companiesTotalCount: number = 0;
  public get CompaniesTotalCount(): number {
    return this._companiesTotalCount;
  }

  private _companies: Company[] = [];
  public get Companies(): Company[] {
    return this._companies || [];
  }

  private _okveds: DictionaryItem[];
  public get Okveds(): DictionaryItem[] {
    return this._okveds || [];
  }

  private _regions: DictionaryItem[];
  public get Regions(): DictionaryItem[] {
    return this._regions || [];
  }

  public searchRequest: string;

  constructor(private titleService: Title, private router: Router, private route: ActivatedRoute,
    private http: HttpClient) {
    this.titleService.setTitle("UrBaseInfo -  Поиск юридических лиц");

    this.retrieveAllOkveds();
    this.retrieveAllRegions();

    this._nextWcfUrl = environment.apiHost + "/companies";
    let queryParamValue = this.route.snapshot.queryParamMap.get("query");
    let baseTypeParamValue = this.route.snapshot.queryParamMap.get("baseType");
    if (queryParamValue) {
      this.searchRequest = queryParamValue;
      this._nextWcfUrl += "?query=" + queryParamValue;
    }
    else if (baseTypeParamValue) {
      if (baseTypeParamValue == "moscow") {
        this._nextWcfUrl += "?region_in=7,8";
      }
      else if (baseTypeParamValue == "spiter") {
        this._nextWcfUrl += "?region_in=15,6";
      }
      else if (baseTypeParamValue == "eburg") {
        this._nextWcfUrl += "?region_in=3";
      }
    }
    this.loadData(this._nextWcfUrl);
  }

  ngOnInit() {
  }

  public onScroll(): void {
    this.loadData(this._nextWcfUrl);
  }

  private loadData(wcfUrl: string): void {
    this._isLoading = true;
    this.http.get<CompaniesResult>(wcfUrl).subscribe(data => {
      this._companiesTotalCount = data.count;
      this._companies = this._companies.concat(data.results);
      this._nextWcfUrl = data.next;
      this._isLoading = false;
    });
  }

  private retrieveAllOkveds(): void {
    let wcfUrl = environment.apiHost + "/okved?limit=3000";
    this.http.get<OkvedsResult>(wcfUrl).subscribe(data => {
      this._okveds = data.results;
    });
  }

  private retrieveAllRegions(): void {
    let wcfUrl = environment.apiHost + "/regions?limit=200";
    this.http.get<RegionsResult>(wcfUrl).subscribe(data => {
      this._regions = data.results;
    });
  }

  public btnSearchClicked(event: any): void {
    this._nextWcfUrl = environment.apiHost + "/companies?query=" + this.searchRequest;
    this._companies = [];
    this.loadData(this._nextWcfUrl);
  }

  public onSearchPressKeyDown(event: any): void {
    this.btnSearchClicked(event);
  }
}
