import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentsService } from '@app/pages/students/services/students.service';
import { Observable, Subject, filter, map, switchMap, take, takeUntil } from 'rxjs';
import { Student } from '@app/pages/students/models/student';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation.service';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { ConfirmationConfig } from '@app/shared/model/confirmation-config';
import { SelectionModel } from '@angular/cdk/collections';
import { TableUtil } from '@app/shared/utils/table-utils';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentsListComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['select', 'name', 'email', 'address', 'class', 'points', 'subjects', 'actions'];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  selectedRowIds: Set<number> = new Set<number>();
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  students: Student[];
  initialSelection = [];
  allowMultiSelect = true;
  selection: SelectionModel<any> = new SelectionModel<any>;
  @ViewChild('input') inputElement!: ElementRef<HTMLInputElement>; // Accessing the input element
  startDate: Date | null = null;
  endDate: Date | null = null;
  filterValue: string = '';
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
      .pipe(
        takeUntil(this._unsubscribeAll),
        map((_students) => _students.formatDateTime())
      )
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


  toggleAllRows(event: any) {
    const checked = event.checked;
    if (checked) {
      this.dataSource.filteredData.forEach(row => this.selection.select(row));
      this.selectedRowIds = new Set(this.dataSource.filteredData.map(row => row.id));
    } else {
      this.selection.clear();
      this.selectedRowIds.clear();
    }
  }

  applyDateRangeFilter() {
    if (this.startDate) {
      this.startDate.setHours(0, 0, 0, 0);
    }
    if (this.endDate) {
      this.endDate.setHours(23, 59, 59, 999);
    }
    this.applyFilters();
  }
  clear() {
    this.filterValue = "";
    (this.inputElement.nativeElement as HTMLInputElement).value = "";
    this.endDate = null;
    this.startDate = null;
    this.dataSource.data = [...this.students];

    this.selection.clear();
    this.selectedRowIds.clear();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this._changeDetectorRef.detectChanges();
  }

  applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.applyFilters();
  }

  private applyFilters() {
    let filteredData = this.dataSource.data;

    // Apply text filter
    if (this.filterValue) {
      filteredData = filteredData.filter(row =>
        row.name.toLowerCase().includes(this.filterValue) ||
        row.email.toLowerCase().includes(this.filterValue) ||
        row.mobile.toLowerCase().includes(this.filterValue) ||
        row.class.toLowerCase().includes(this.filterValue) ||
        row.createdOn.toLowerCase().includes(this.filterValue)
      );
    }

    // Apply date range filter
    if (this.startDate || this.endDate) {
      filteredData = filteredData.filter(row => {
        const itemDate = new Date(row.createdOn);
        return (!this.startDate || itemDate >= this.startDate) &&
          (!this.endDate || itemDate <= this.endDate);
      });
    }

    this.dataSource.data = filteredData;

    // Update the selection based on the filtered data
    const newSelection = filteredData.filter(row => this.selectedRowIds.has(row.id));
    this.selection.clear();
    this.selection.select(...newSelection);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this._changeDetectorRef.detectChanges();
  }

  isAllSelected() {
    const numRows = this.dataSource.filteredData.length;
    const numSelected = this.selection.selected.length;
    return numSelected === numRows;
  }

  isIndeterminate() {
    const numRows = this.dataSource.filteredData.length;
    const numSelected = this.selection.selected.length;
    return numSelected > 0 && numSelected < numRows;
  }


  onSelectRow(row: any) {
    this.selection.toggle(row);
    if (this.selection.isSelected(row)) {
      this.selectedRowIds.add(row.id);
    } else {
      this.selectedRowIds.delete(row.id);
    }
  }

  export() {
    let data = this.dataSource.filteredData;
    const input = this.inputElement.nativeElement as HTMLInputElement;
    const filterValue = input.value;
    data = data.map((el) => {
      return {
        Name: el.name,
        Email: el.email,
        Mobile: el.mobile,
        Class: el.class,
        Address: el.address,
        subjects: el.subjects,
      }

    }).map((el: any) => this.transformObject(el));
    TableUtil.exportArrayToExcel(data, filterValue);
  }



  transformObject(obj: any): any {
    const transformedSubjects = Object.keys(obj.subjects).reduce((acc: any, key: string) => {
      acc[key] = obj.subjects[key].status;
      return acc;
    }, {});

    // Construct the new object without the subjects field
    const { subjects, ...rest } = obj; // Destructure to remove subjects
    const newObject = {
      ...rest,
      ...transformedSubjects // Merge transformed subjects as top-level properties
    };
    return newObject;
  }
}
