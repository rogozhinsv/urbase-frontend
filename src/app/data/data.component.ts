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
import { DataRequestService } from '../services/data-request.service';

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

  private _selectedOkvedsIds: number[] = [];
  public get SelectedOkvedIds(): number[] {
    return this._selectedOkvedsIds || [];
  }

  private _selectedRegionsIds: number[] = [];
  public get SelectedRegionsIds(): number[] {
    return this._selectedRegionsIds || [];
  }

  private _regions: DictionaryItem[];
  public get Regions(): DictionaryItem[] {
    return this._regions || [];
  }

  public searchRequest: string;

  constructor(private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dataRequestService: DataRequestService) {
    this.titleService.setTitle("UrBaseInfo -  Поиск юридических лиц");

    this.retrieveAllOkveds();
    this.retrieveAllRegions();

    this._nextWcfUrl = environment.apiHost + "/companies";
    let queryParamValue = this.route.snapshot.queryParamMap.get("query");
    let baseTypeParamValue = this.route.snapshot.queryParamMap.get("baseType");
    if (queryParamValue) {
      this.searchRequest = queryParamValue;
      this.loadData(this.searchRequest, [], [], true);
    }
    else if (baseTypeParamValue) {
      if (baseTypeParamValue == "moscow") {
        this.loadData(this.searchRequest, [7, 8], [], true);
      }
      else if (baseTypeParamValue == "spiter") {
        this.loadData(this.searchRequest, [6, 15], [], true);
      }
      else if (baseTypeParamValue == "eburg") {
        this.loadData(this.searchRequest, [3], [], true);
      }
    }
  }

  ngOnInit() {
  }

  public onScroll(): void {
    this._isLoading = true;
    this.dataRequestService.getCompanies(this._nextWcfUrl).subscribe(data => {
      this._companiesTotalCount = data.count;
      this._companies = this._companies.concat(data.results);
      this._nextWcfUrl = data.next;
      this._isLoading = false;
    });
  }

  private loadData(filter: string, regionsIds: number[], okvedsIds: number[], isFirstLoad: boolean): void {
    this._isLoading = true;
    this.dataRequestService.getCompaniesByFilter(filter, regionsIds, okvedsIds).subscribe(data => {
      this._companiesTotalCount = data.count;
      this._companies = data.results;
      this._nextWcfUrl = data.next;
      this._isLoading = false;

      if (isFirstLoad) {
        this._selectedOkvedsIds = data.okveds;
        this._selectedRegionsIds = data.regions;
      }
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
    this._companies = [];
    this.loadData(this.searchRequest, this.SelectedRegionsIds, this.SelectedOkvedIds, false);
  }

  public onSearchPressKeyDown(event: any): void {
    this.btnSearchClicked(event);
  }

  public isSelectedOkved(item: DictionaryItem): boolean {
    return this.SelectedOkvedIds.some(x => x == item.id);
  }

  public isSelectedRegion(item: DictionaryItem): boolean {
    return this.SelectedRegionsIds.some(x => x == item.id);
  }

  public cbxRegionChanged(event: any, item: DictionaryItem): void {
    this.updateSelectedIdsArray(this.SelectedRegionsIds, item);
    this.loadData(this.searchRequest, this.SelectedRegionsIds, this.SelectedOkvedIds, false);
  }

  public cbxOkvedChanged(event: any, item: DictionaryItem): void {
    this.updateSelectedIdsArray(this.SelectedRegionsIds, item);
    this.loadData(this.searchRequest, this.SelectedRegionsIds, this.SelectedOkvedIds, false);
  }

  private updateSelectedIdsArray(array: number[], item: DictionaryItem): void {
    let index: number = array.indexOf(item.id);
    if (index !== -1) {
      array.splice(index, 1);
    }
    else {
      array.push(item.id);
    }
  }
}
