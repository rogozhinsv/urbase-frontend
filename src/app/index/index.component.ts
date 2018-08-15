import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: []
})
export class IndexComponent implements OnInit {
  public searchRequest: string;

  public constructor(private titleService: Title, private router: Router) {
    this.titleService.setTitle("UrBaseInfo - Актуальная база юридических лиц РФ");
  }

  ngOnInit() {
  }

  public btnSearchClicked(): void {
    this.routeToDataPage();
  }

  public onSearchPressKeyDown(event: any): void {
    this.routeToDataPage();
  }

  private routeToDataPage() {
    if (this.searchRequest) {
      this.router.navigate(["/data"], { queryParams: { query: this.searchRequest } });
    }
    else {
      this.router.navigate(["/data"]);
    }
  }
}
