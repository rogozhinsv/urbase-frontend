import { Injectable } from "@angular/core";
import { CompaniesResult } from "../models/companies-result";
import { environment } from "../../environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { RegionsResult } from "../models/regions-result";
import { OkvedsResult } from "../models/okveds-result";

@Injectable({
    providedIn: "root"
})
export class DataRequestService {
    constructor(private http: HttpClient) { }

    public getRegions(ids: number[]): Observable<RegionsResult> {
        let url = environment.apiHost + "/regions?limit=500";
        if (ids.length > 0) {
            url += "&id=" + ids.join(",");
        }

        return this.http.get<RegionsResult>(url);
    }

    public getOkveds(ids: number[]): Observable<OkvedsResult> {
        let url = environment.apiHost + "/okved?limit=5000";
        if (ids.length > 0) {
            url += "&id=" + ids.join(",");
        }

        return this.http.get<OkvedsResult>(url);
    }

    public getAllOkveds(): Observable<OkvedsResult> {
        return this.http.get<OkvedsResult>(environment.apiHost + "/okved?limit=5000");
    }

    public getAllRegions(): Observable<RegionsResult> {
        return this.http.get<RegionsResult>(environment.apiHost + "/regions?limit=500");
    }

    public getCompanies(url: string): Observable<CompaniesResult> {
        return this.http.get<CompaniesResult>(url);
    }

    public getCompaniesByFilter(filter: string, regionIds: number[], okvedIds: number[]): Observable<CompaniesResult> {
        let url = environment.apiHost + "/companies";
        let emptyRequest: boolean = true;

        if (filter) {
            url += "?query=" + filter;
            emptyRequest = false;
        }

        if (regionIds.length > 0) {
            let urlPart = "region_in=" + regionIds.join(",");
            if (emptyRequest) {
                url += "?" + urlPart;
            }
            else {
                url += "&" + urlPart;
            }
            emptyRequest = false;
        }

        if (okvedIds.length > 0) {
            let urlPart = "okved_in=" + okvedIds.join(",");
            if (emptyRequest) {
                url += "?" + urlPart;
            }
            else {
                url += "&" + urlPart;
            }
            emptyRequest = false;
        }

        return this.http.get<CompaniesResult>(url);
    }
}