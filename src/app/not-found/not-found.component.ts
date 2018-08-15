import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: []
})
export class NotFoundComponent implements OnInit {

  constructor(private titleService: Title) {
    this.titleService.setTitle("UrBaseInfo - Страница не найдена");
  }

  ngOnInit() {
  }

}
