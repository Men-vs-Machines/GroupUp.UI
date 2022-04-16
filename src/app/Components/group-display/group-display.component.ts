import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { GroupUpApiService } from "../../Services/group-up-api.service";
import { Destroyable } from "../../Utils/destroyable";
import { filter, takeUntil } from "rxjs";

@Component({
  selector: 'app-group-display',
  templateUrl: './group-display.component.html',
  styleUrls: ['./group-display.component.scss']
})
export class GroupDisplayComponent extends Destroyable implements OnInit {

  constructor(private _activatedRoute: ActivatedRoute, private _groupUpApiService: GroupUpApiService) {
    super();
  }

  ngOnInit(): void {
    const groupId = this._activatedRoute.snapshot.params['id'];

    this._groupUpApiService.getGroup(groupId)
      .pipe(
        filter(group => !!group),
        takeUntil(this.destroy$)
      ).subscribe(console.log.bind(this))
  }

}