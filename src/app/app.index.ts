import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.index.html',
  styleUrls: ['./app.index.css']
})
export class AppIndex {
  public constructor(private titleService: Title) {
    this.titleService.setTitle("UrBase Info Актуальная база юридических лиц РФ");
  }
}
