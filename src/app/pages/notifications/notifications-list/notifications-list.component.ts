import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>()
  constructor(private _router: Router,
    private _route: ActivatedRoute,
  ) {

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete()
  }

  ngOnInit(): void {

  }
  add() {
    console.log("addd");
    this._router.navigate(['./', "add"], { relativeTo: this._route })
  }

}
