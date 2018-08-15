import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../models/company';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: []
})
export class CompanyComponent implements OnInit {
  public company: Company;

  constructor(private titleService: Title, private route: ActivatedRoute, private http: HttpClient) {
    this.titleService.setTitle("UrBaseInfo - О компании");
    let companyId = this.route.snapshot.params.id;
    this.http.get(environment.apiHost + "/companies/" + companyId).subscribe((data: Company) => {
      this.company = data;
    });
  }

  ngOnInit() {
  }

}
