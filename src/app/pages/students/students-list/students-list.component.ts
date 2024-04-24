import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentsService } from '@app/pages/students/services/students.service';
import { Observable, Subject, filter, map, switchMap, take, takeUntil } from 'rxjs';
import { Student } from '@app/pages/students/models/student';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation.service';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { ConfirmationConfig } from '@app/shared/model/confirmation-config';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentsListComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['select', 'name', 'email', 'address', 'class', 'points', 'subjects', 'actions'];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  students: Student[];
  initialSelection = [];
  allowMultiSelect = true;
  selection: SelectionModel<any>;

  constructor(private _service: StudentsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _confirmationService: ConfirmationService,
    private _toastService: ToastService
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit() {
    this._service.students$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((students: Student[]) => {
        this.dataSource.data = JSON.parse(JSON.stringify(students))
        this.students = [...students];
        this.selection = new SelectionModel<any>(this.allowMultiSelect, this.initialSelection);

        this._changeDetectorRef.detectChanges();
      });

  }
  updatePurchaseStatus(subject, status, index) {
    const config: ConfirmationConfig = {
      title: "Confirm Update", message: "Are you sure, you want to update purchase status of this subject?"
    }

    this._confirmationService.open(config).afterClosed().pipe(take(1),
      filter((result) => result),
      switchMap((response) => {
        this.students[index]['subjects'][subject]['status'] = !status;
        this.students[index]['subjects'][subject]['self'] = false;
        return this._service.updatePurchaseStatus(index, this.students[index])
      }),
      map(el => {
        this._toastService.showSuccess("Updated successfully")
      })
    )
      .subscribe();
    //  this._service.updatePurchaseStatus(index, this.students[index]).pipe().subscribe()
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

    const students = (data instanceof Array) ? data : this.dataSource.data.filter(el => el.id == data);
    this.confirmDelete(students)
  }

  confirmDelete(students) {
    this._confirmationService.open().afterClosed().pipe(take(1),
      filter((result) => result),
      switchMap((response) => {
        return this._service.deleteStudents(students)
      }),
      map(el => {
        this._toastService.showSuccess("Removed successfully")
        return el;
      })
    )
      .subscribe();
  }
  deleteNotification(students: any[]): Observable<any> {
    return this._service.deleteStudents(students)
      .pipe(takeUntil(this._unsubscribeAll))
  }

}
