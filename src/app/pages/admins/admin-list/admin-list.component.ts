import { SelectionModel } from '@angular/cdk/collections';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject, filter, map, switchMap, take, takeUntil } from 'rxjs';
import { AdminService } from '../service/admin.service';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation.service';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit, OnDestroy {

  public displayedColumns: string[] = ['select', 'name', 'email', 'address', 'class', 'points', 'subjects', 'actions'];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  admins: any[];
  initialSelection = [];
  allowMultiSelect = true;
  selection: SelectionModel<any>;

  constructor(private _service: AdminService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _confirmationService: ConfirmationService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _toastService: ToastService) {

  }
  ngOnInit() {
    this._service.admins$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((admins: any[]) => {
        console.log("admins ", admins)
        this.dataSource.data = JSON.parse(JSON.stringify(admins))
        this.admins = [...admins];
        this.selection = new SelectionModel<any>(this.allowMultiSelect, this.initialSelection);

        this._changeDetectorRef.detectChanges();
      });
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
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

    const admins = (data instanceof Array) ? data : this.dataSource.data.filter(el => el.id == data);
    this.confirmDelete(admins)
  }

  confirmDelete(admins) {
    this._confirmationService.open().afterClosed().pipe(take(1),
      filter((result) => result),
      switchMap((response) => {
        return this._service.deleteAdmins(admins)
      }),
      map(el => {
        this._toastService.showSuccess("Removed successfully")
        return el;
      })
    )
      .subscribe();
  }

  deleteNotification(admins: any[]): Observable<any> {
    return this._service.deleteAdmins(admins)
      .pipe(takeUntil(this._unsubscribeAll))
  }

  adsOrEdit(event) {
    this._router.navigate(['./', event], { relativeTo: this._route })
  }
}
