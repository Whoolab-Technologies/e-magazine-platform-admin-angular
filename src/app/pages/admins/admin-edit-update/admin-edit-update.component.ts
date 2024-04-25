import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { AdminService } from '../service/admin.service';
import { Subject, catchError, filter, map, take, takeUntil } from 'rxjs';
import { ActivatedRoute, Route, Router } from '@angular/router';

@Component({
  selector: 'app-admin-edit-update',
  templateUrl: './admin-edit-update.component.html',
  styleUrls: ['./admin-edit-update.component.scss']
})
export class AdminEditUpdateComponent implements OnInit, OnDestroy {
  title: string = "Add New";
  edit: boolean = false;
  hide: boolean = true;
  admin: any = {}
  class: any = {}
  password: string;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  constructor(private _service: AdminService,
    private _activatedRoute: ActivatedRoute,
    private _toastService: ToastService,
    private _router: Router,) {

  }
  ngOnInit(): void {
    this._service.admin$.pipe(takeUntil(this._unsubscribeAll), filter((resp) =>

      resp
    ), map((admin) => {
      this.title = "Edit"
      this.edit = true
      this.admin = admin;
      return admin
    })).subscribe()
    this._service.class$.pipe(takeUntil(this._unsubscribeAll), map((_class) => {
      const subjects = this.appendPropertiesToSubjects(_class.subjects)
      _class.subjects = subjects;
      return _class;
    }))
      .subscribe((_class) => {
        this.class = _class
      })
  }
  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  createAdmin() {
    if (!(this.admin.name && this.admin.email && this.admin.mobile)) {
      this._toastService.showErrorToastr("All fields are required");
      return;
    }
    if (!this.password) {
      this._toastService.showErrorToastr("Password is required");
      return;
    }
    this.admin.class = this.class.id;
    this.admin.subjects = this.class.subjects;
    this.admin.points = 0;
    this.admin.referralCode = this.generateRandomString()

    this.admin.referrrer = "";
    this.admin.syllabus = "CBSE"
    this.admin.lastRead = "";
    this.admin.image = "";
    console.log(this.admin)
    this._service.createAdmin(this.admin, this.password).pipe(take(1), map((admin) => {
      return admin
    }),

    ).subscribe((res) => {
      this._toastService.showSuccess(res.msg)
    }, (error) => {

      this._toastService.showErrorToastr(error ? error.message ?
        error.message : JSON.stringify(error) :
        "Something went wrong!",
      )
    });
  }

  editAdmin() {

  }


  cancel() {
    this._router.navigate(['../'], { relativeTo: this._activatedRoute });
  }

  appendPropertiesToSubjects(subjects: { [key: string]: any }): { [key: string]: any } {
    const updatedSubjects: { [key: string]: any } = {};
    for (const key in subjects) {
      if (subjects.hasOwnProperty(key)) {
        const subject = subjects[key];
        updatedSubjects[key] = { ...subject, self: true, status: true };
      }
    }
    return updatedSubjects;
  }

  generateRandomString(length: number = 6): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
}
