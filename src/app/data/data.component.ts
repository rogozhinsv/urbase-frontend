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
  private _selectedRegionIds: number[] = [];
  private _selectedOkvedIds: number[] = [];

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

  private _foundedOkvedIds: DictionaryItem[] = [];
  public get FoundedOkvedIds(): DictionaryItem[] {
    return this._foundedOkvedIds || [];
  }

  private _foundedRegionIds: DictionaryItem[] = [];
  public get FoundedRegionIds(): DictionaryItem[] {
    return this._foundedRegionIds || [];
  }

  public searchRequest: string;

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
      this.loadData(true);
    }
    else if (baseTypeParamValue) {
      if (baseTypeParamValue == "moscow") {
        this._selectedRegionIds = [7, 8];
        this.loadData(true);
      }
      else if (baseTypeParamValue == "spiter") {
        this._selectedRegionIds = [6, 15];
        this.loadData(true);
      }
      else if (baseTypeParamValue == "eburg") {
        this._selectedRegionIds = [3];
        this.loadData(true);
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

  private loadData(isFirstLoad: boolean): void {
    this._isLoading = true;
    this.dataRequestService.getCompaniesByFilter(this.searchRequest, this._selectedRegionIds, this._selectedOkvedIds).subscribe(data => {
      this._companiesTotalCount = data.count;
      this._companies = data.results;
      this._nextWcfUrl = data.next;
      this._isLoading = false;

      if (isFirstLoad) {
        this.dataRequestService.getRegions(data.regions).subscribe(data => this._foundedRegionIds = data.results);
        this.dataRequestService.getAllOkveds().subscribe(okvedsResults => {
          let allItems = okvedsResults.results;
          this._foundedOkvedIds = allItems.filter(x => data.okveds.some(y => y == x.id));
        });
      }
    });
  }

  public btnSearchClicked(event: any): void {
    this._companies = [];
    this._selectedOkvedIds = [];
    this._selectedRegionIds = [];
    this.loadData(false);
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
}
