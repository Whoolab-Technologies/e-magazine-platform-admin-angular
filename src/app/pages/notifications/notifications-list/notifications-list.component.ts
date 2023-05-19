import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '@app/pages/notifications/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>()
  public displayedColumns: string[] = ['title', 'message', 'class', 'date',];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions = [10, 15, 20, 50, 100];
  notifications: any[];
  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _service: NotificationService,
    private _changeDetectorRef: ChangeDetectorRef
  ) {

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete()
  }

  ngOnInit(): void {
    this._service.notifications$.pipe(takeUntil(this._unsubscribeAll)).subscribe((notifications) => {
      this.dataSource.data = JSON.parse(JSON.stringify(notifications))
      this.notifications = [...notifications];
      console.log('notifications ')
      console.log(notifications)
      this._changeDetectorRef.detectChanges();
    });
  }
  add() {
    console.log("addd");
    this._router.navigate(['./', "add"], { relativeTo: this._route })
  }

}
