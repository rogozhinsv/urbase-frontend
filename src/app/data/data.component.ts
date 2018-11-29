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
import { forkJoin, Observable } from 'rxjs';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: []
})
export class DataComponent implements OnInit {
  private _nextWcfUrl: string = "";
  private _limitRegions: number = 10;
  private _limitOkveds: number = 10;

  private _isVisibleAllRegions: boolean = false;
  public get IsVisibleAllRegions(): boolean {
    return this._isVisibleAllRegions;
  }

  private _isVisibleAllOkveds: boolean = false;
  public get IsVisibleAllOkveds(): boolean {
    return this._isVisibleAllOkveds;
  }

  private _selectedRegionIds: number[] = [];
  public get SelectedRegionIds(): number[] {
    return this._selectedRegionIds || [];
  }

  private _selectedOkvedIds: number[] = [];
  public get SelectedOkvedIds(): number[] {
    return this._selectedOkvedIds || [];
  }

  private _allOkvedsItems: DictionaryItem[] = [];
  private _allRegionItems: DictionaryItem[] = [];

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

  private _foundedOkvedItems: DictionaryItem[] = [];
  public get FoundedOkvedItems(): DictionaryItem[] {
    let items = this._foundedOkvedItems || []; 
    if (this.okvedFilter) {
      items = items.filter(x => x.title.search(new RegExp(this.okvedFilter, "i")) != -1);
    }
    return items.slice(0, this._limitOkveds);
  }
  public get FoundedOkvedItemsCount(): number {
    return (this._foundedOkvedItems || []).length;
  }

  private _foundedRegionItems: DictionaryItem[] = [];
  public get FoundedRegionItems(): DictionaryItem[] {
    let items = this._foundedRegionItems || []; 
    if (this.regionsFilter) {
      items = items.filter(x => x.title.search(new RegExp(this.regionsFilter, "i")) != -1);
    }
    return items.slice(0, this._limitRegions);
  }
  public get FoundedRegionItemsCount(): number {
    return (this._foundedRegionItems || []).length;
  }

  public regionsFilter: string;
  public searchRequest: string;
  private okvedFilter: string;

  constructor(private titleService: Title,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private dataRequestService: DataRequestService) {
    this.titleService.setTitle("UrBaseInfo -  Поиск юридических лиц");

    this._nextWcfUrl = environment.apiHost + "/companies";
    let queryParamValue = this.route.snapshot.queryParamMap.get("query");
    let baseTypeParamValue = this.route.snapshot.queryParamMap.get("baseType");
    if (queryParamValue) {
      this.searchRequest = queryParamValue;
    }
    else if (baseTypeParamValue) {
      if (baseTypeParamValue == "moscow") {
        this._selectedRegionIds = [7, 8];
      }
      else if (baseTypeParamValue == "spiter") {
        this._selectedRegionIds = [6, 15];
      }
      else if (baseTypeParamValue == "eburg") {
        this._selectedRegionIds = [3];
      }
    }

    forkJoin(this.dataRequestService.getAllRegions(),
      this.dataRequestService.getAllOkveds()).subscribe(data => {
        this._allOkvedsItems = data[1].results;
        this._allRegionItems = data[0].results;

        this.loadData(true);
      });
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

  private loadData(isFirstLoad: boolean): void {
    this._isLoading = true;
    this.dataRequestService.getCompaniesByFilter(this.searchRequest, this._selectedRegionIds, this._selectedOkvedIds).subscribe(data => {
      this._companiesTotalCount = data.count;
      this._companies = data.results;
      this._nextWcfUrl = data.next;
      this._isLoading = false;

      if (isFirstLoad) {
        this._foundedOkvedItems = this._allOkvedsItems.filter(x => data.okveds.some(y => y == x.id));
        this._foundedRegionItems = this._allRegionItems.filter(x => data.regions.some(y => y == x.id));
      }
    });
  }

  public btnSearchClicked(event: any): void {
    this._companies = [];
    this._selectedOkvedIds = [];
    this._selectedRegionIds = [];
    this.loadData(true);
  }

  public onSearchPressKeyDown(event: any): void {
    this.btnSearchClicked(event);
  }

  public onSelectRegion(event: any, item: DictionaryItem): void {
    item.checked = !item.checked;
    this.updateSelectedIdsArray(this._selectedRegionIds, item);
    this.loadData(false);

    event.preventDefault();
  }

  public onSelectOkved(event: any, item: DictionaryItem): void {
    item.checked = !item.checked;
    this.updateSelectedIdsArray(this._selectedOkvedIds, item);
    this.loadData(false);

    event.preventDefault();
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

  public onShowAllRegions_Clicked(event: any): void {
    this._isVisibleAllRegions = true;
    this._limitRegions = 500;

    event.preventDefault()
  }

  public onHideAllRegions_Clicked(event: any): void {
    this._isVisibleAllRegions = false;
    this._limitRegions = 10;
    this.regionsFilter = "";

    event.preventDefault()
  }

  public onShowAllOkveds_Clicked(event: any): void {
    this._isVisibleAllOkveds = true;
    this._limitOkveds = 5000;

    event.preventDefault()
  }

  public onHideAllOkveds_Clicked(event: any): void {
    this._isVisibleAllOkveds = false;
    this._limitOkveds = 10;
    this.okvedFilter= "";

    event.preventDefault()
  }
}
