import { Injectable } from "@angular/core";
import { CompaniesResult } from "../models/companies-result";
import { environment } from "../../environments/environment.prod";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class DataRequestService {
    constructor(private http: HttpClient) { }

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
        }

        if (okvedIds.length > 0) {
            let urlPart = "okved_in=" + okvedIds.join(",");
            if (emptyRequest) {
                url += "?" + urlPart;
            }
            else {
                url += "&" + urlPart;
            }
        }

        return this.http.get<CompaniesResult>(url);
    }
}