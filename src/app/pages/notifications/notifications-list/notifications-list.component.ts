import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject, filter, map, switchMap, take, takeUntil } from 'rxjs';
import { NotificationService } from '@app/pages/notifications/service/notification.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation.service';
import { ToastService } from '@app/shared/services/toast/toast.service';

@Component({
  standalone: false,
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.scss']
})
export class NotificationsListComponent implements OnInit, OnDestroy {
  private _unsubscribeAll: Subject<any> = new Subject<any>()
  public displayedColumns: string[] = ['select', 'title', 'message', 'class', 'date', 'action'];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  initialSelection = [];
  allowMultiSelect = true;
  selection: SelectionModel<any>;
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions = [10, 15, 20, 50, 100];
  notifications: any[];
  constructor(private _router: Router,
    private _route: ActivatedRoute,
    private _service: NotificationService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _toastService: ToastService,
    private _confirmationService: ConfirmationService,
  ) {

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete()
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this._service.notifications$.pipe(takeUntil(this._unsubscribeAll)).subscribe((notifications) => {
      this.dataSource.data = JSON.parse(JSON.stringify(notifications))
      this.notifications = [...notifications];
      this.dataSource.paginator = this.paginator;
      this.selection = new SelectionModel<any>(this.allowMultiSelect, this.initialSelection);
      this._changeDetectorRef.detectChanges();
    });
  }
  add() {
    this._router.navigate(['./', "add"], { relativeTo: this._route })
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected == numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
  }



  delete(data: Array<any> | string) {

    const notifications = (data instanceof Array) ? data : this.dataSource.data.filter(notification => notification.id == data);
    this.confirmDelete(notifications)
  }

  confirmDelete(notifications) {
    this._confirmationService.open().afterClosed().pipe(take(1),
      filter((result) => result),
      switchMap((response) => {
        return this._service.deleteNotification(notifications)
      }),
      map(el => {
        this._toastService.showSuccess("Removed successfully")
        return el;
      })
    )
      .subscribe();
  }
  deleteNotification(notifications: any[]): Observable<any> {
    return this._service.deleteNotification(notifications)
      .pipe(takeUntil(this._unsubscribeAll))
  }
}
