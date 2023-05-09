import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { StudentsService } from '@app/pages/students/services/students.service';
import { Subject, takeUntil } from 'rxjs';
import { Student } from '@app/pages/students/models/student';

@Component({
  selector: 'app-students-list',
  templateUrl: './students-list.component.html',
  styleUrls: ['./students-list.component.scss']
})
export class StudentsListComponent implements OnInit, OnDestroy {
  public displayedColumns: string[] = ['name', 'email', 'address', 'class', 'subjects'];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();

  private _unsubscribeAll: Subject<any> = new Subject<any>();
  students: Student[];
  constructor(private _service: StudentsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit() {
    this._service.students$
      .pipe(takeUntil(this._unsubscribeAll))
      .subscribe((students: Student[]) => {
        this.dataSource.data = students;
        this.students = [...students];
        // Mark for check
        this._changeDetectorRef.markForCheck();
      });

  }
}
