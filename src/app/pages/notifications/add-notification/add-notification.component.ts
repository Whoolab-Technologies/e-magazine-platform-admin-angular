import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from '@app/pages/notifications/service/notification.service';
import { ToastPositionTypes } from '@app/shared/model/toast';
import { isNullish } from '@app/shared/services/app/app.service';
import { ToastService } from '@app/shared/services/toast/toast.service';
import * as moment from 'moment';
import { Observable, Subject, map, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-add-notification',
  templateUrl: './add-notification.component.html',
  styleUrls: ['./add-notification.component.scss']
})
export class AddNotificationComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['select', 'name', 'class', 'email',];
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource = new MatTableDataSource<any>();
  pageSizeOptions = [10, 15, 20, 50, 100];

  selection = new SelectionModel<any>(true, []);
  private _unsubscribeAll: Subject<any> = new Subject<any>()
  classes$: Observable<any>;
  class: string;
  students: any[]
  notification: any = {
    title: '',
    message: '',
  }
  disableBtn: boolean = false;
  constructor(private _service: NotificationService, private _toastService: ToastService) {

  }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.classes$ = this._service.classes$.pipe(takeUntil(this._unsubscribeAll))
    this._service.students$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      this.dataSource = new MatTableDataSource(resp);
      this.dataSource.paginator = this.paginator;
      this.students = resp
      if (this.selection)
        this.selection.clear();
    })).subscribe();

    this._service.class$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      this.class = resp;
    })).subscribe();

  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);

    this._unsubscribeAll.complete();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data.map(el => el.id));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  changeClass() {
    this._service.getFilteredStudents(this.class).subscribe()
  }
  createNotification() {
    if (!this.selection.selected.length) {
      this._toastService.showInfoToastr("No students selected from the list!", ToastPositionTypes.topRight)
      return;
    }
    if (isNullish(this.notification)) {
      this._toastService.showInfoToastr("All fields are required", ToastPositionTypes.topRight)
      return;
    }
    this.disableBtn = true
    this.notification.createdOn = moment().toDate();
    this.notification.class = this.class;

    this._service.createNotification(this.notification, this.selection.selected).pipe(tap(el => {
      this._toastService.showSuccess("Notification has been created successfully")
      this.reset()

    })).subscribe();

  }
  reset() {
    this.selection.clear();
    this.notification = {
      title: '',
      message: '',
    }
    this.disableBtn = false
  }
}