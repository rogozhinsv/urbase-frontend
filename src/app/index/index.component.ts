import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: []
})
export class IndexComponent implements OnInit {

  public constructor(private titleService: Title) {
    this.titleService.setTitle("UrBase Info Актуальная база юридических лиц РФ");
  }

  ngOnInit() {
  }

}
