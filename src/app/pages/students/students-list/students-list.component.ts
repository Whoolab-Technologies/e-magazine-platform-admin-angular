import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentsService } from '@app/pages/students/services/students.service';
import { Subject, filter, map, switchMap, take, takeUntil } from 'rxjs';
import { Student } from '@app/pages/students/models/student';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation.service';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { ConfirmationConfig } from '@app/shared/model/confirmation-config';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StudentsListComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['name', 'email', 'address', 'class', 'points', 'subjects'];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  students: Student[];
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

}
