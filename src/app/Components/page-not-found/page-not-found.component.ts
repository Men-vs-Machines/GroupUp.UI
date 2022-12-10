import { Component, OnInit } from '@angular/core';

@Component({
  template: `
    <div style="margin: 2rem; color: whitesmoke">
      <h1 class="mat-display-2">Page not found</h1>
      <h4>
        <a routerLink="/index">Return Home</a>
      </h4>
    </div>
  `,
  selector: 'app-page-not-found',
  styleUrls: ['./page-not-found.component.scss']
})
export class PageNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
