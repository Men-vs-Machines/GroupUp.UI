import {Component} from '@angular/core';
import { connect } from '@rxjs-insights/devtools/connect';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  ngOnInit(): void {
    connect();
  }
}
