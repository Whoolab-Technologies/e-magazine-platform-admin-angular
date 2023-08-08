import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatLegacyPaginator as MatPaginator } from '@angular/material/legacy-paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { EditionsService } from '@app/pages/editions/services/editions.service';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation.service';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { Observable, Subject, filter, map, switchMap, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-editions-list',
  templateUrl: './editions-list.component.html',
  styleUrls: ['./editions-list.component.scss']
})
export class EditionsListComponent implements OnInit, OnDestroy {
  classes$: Observable<any>;
  subjects$: Observable<any>;
  editions: any[];
  class: string;
  subject: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  displayedColumns: string[] = ['name', 'image', 'description', 'topics', 'published', 'action'];
  public dataSource: MatTableDataSource<any> = new MatTableDataSource<any>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  pageSizeOptions = [10, 15, 20, 50, 100];
  latestIndex: number = 0;
  constructor(private _service: EditionsService,
    private _router: Router,
    private _confirmationService: ConfirmationService,
    private _toastService: ToastService,
    private _route: ActivatedRoute) {

  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.classes$ = this._service.classes$.pipe(takeUntil(this._unsubscribeAll));
    this.subjects$ = this._service.subjects$.pipe(takeUntil(this._unsubscribeAll));

    this._service.editions$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      this.dataSource.data = resp;
      this.dataSource.paginator = this.paginator;
      this.editions = resp
    })).subscribe();

    this._service.class$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      this.class = resp;
    })).subscribe();

    this._service.subject$.pipe(takeUntil(this._unsubscribeAll), map((resp) => {
      this.subject = resp
    })).subscribe();

  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  changeSubject() {
    this._service.getEditions(this.class, this.subject).subscribe()
  }

  changeClass() {
    this._service.getSubjects(this.class).subscribe()
  }

  edit(event: any) {
    this._router.navigate(['./', event], { relativeTo: this._route })
  }

  view(event: any) {
  }

  delete(event: any) {
    this._confirmationService.open().afterClosed().pipe(take(1),
      filter((result) => result),
      switchMap((response) => {
        return this._service.removeEditon(event);
      }),
      map(el => {
        this._toastService.showSuccess("Removed successfully")
      })
    )
      .subscribe();
  }

  upload() {
    this._router.navigate(['./', 'new'], { relativeTo: this._route })
  }
}
