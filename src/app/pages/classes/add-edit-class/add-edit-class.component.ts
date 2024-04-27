import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef, MatLegacyDialog as MatDialog, } from '@angular/material/legacy-dialog';
import { ClassesService } from '../services/classes.service';
import { Subject, catchError, filter, map, of, switchMap, take, takeLast, takeUntil, tap } from 'rxjs';
import { ToastService } from '@app/shared/services/toast/toast.service';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-edit-class',
  templateUrl: './add-edit-class.component.html',
  styleUrls: ['./add-edit-class.component.scss']
})
export class AddEditClassComponent implements OnInit {
  btnDisabled: boolean = false;
  isEdit: boolean = false;
  showEditSection: boolean = false;
  btnText: string = "Submit";
  actionText: string = "Submit";
  subjects: any[] = [];
  classObj: any = {
    order: 0,
    amount: 0,
    offer_price: 0
  }
  subject: any = {
    id: "",
    name: "",
    amount: 99,
    offer_price: 0,
    enabled: true
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  expiryDate;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _matDialog: MatDialog,
    private _classService: ClassesService,
    private _toastService: ToastService,
    private _confirmationService: ConfirmationService,
    private dialogRef: MatDialogRef<AddEditClassComponent>
  ) {
    this.expiryDate = moment().endOf("day")
      .set({ month: 2, date: 31 });

    // Check if March 31st has already passed this year
    if (moment().isAfter(this.expiryDate, 'day')) {
      // If it has passed, set the date to March 31st of the next year
      this.expiryDate = this.expiryDate.add(1, 'year');
    }
  }

  ngOnDestroy(): void {
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  ngOnInit(): void {
    this.classObj = { ...this.classObj, ...this.data } || { ...this.classObj };
    if (this.data) {
      this.btnText = "Update";
      this.isEdit = true
    }

    this.classObj.expiry_date = (this.classObj.expiry_date) ? (moment(this.classObj.expiry_date?.toDate()).isValid ?
      moment(this.classObj.expiry_date.toDate()).toDate() : this.classObj.expiry_date.toDate()) : this.expiryDate.toDate();

    this.actionText = this.btnText;
    this._classService.subjects$.pipe(takeUntil(this._unsubscribeAll), map((subjects) => {
      subjects = subjects.map(el => { return { ...el, offer_price: el.offer_price ?? 0, } });
      var subj = []
      if (subjects.length) {
        subj = [...subjects];
        if (subjects.length < 4) {
          var temp = []
          for (let index = 0; index < 4 - subjects.length; index++) {
            // this.subject.id = index;
            subj.push(JSON.parse(JSON.stringify(this.subject)));
          }
        }
      }
      else {
        subj = (new Array(4).fill(0)).map((el) => {
          return JSON.parse(JSON.stringify(this.subject));
        });
      }
      return subj
    },
    ),
    ).subscribe((resp) => {
      this.subjects = resp;
    });
  }

  submit() {
    const subjects = this.subjects.filter(el => el.name && el.amount && el.amount > 0);

    if (!this.classObj.name || !this.classObj.amount || !subjects.length) {
      this._toastService.showInfoToastr("All Fields Are Required");
      return;
    }
    this.classObj.expiry_date = moment(this.classObj.expiry_date).endOf("day").toDate();

    this._classService.addOrUpdate(this.classObj, subjects, this.isEdit)
      .pipe(tap((resp: any) => {
        return resp;
      })).subscribe((res: any) => {
        this.btnDisabled = false;
        this.showEditSection = false;
        this.btnText = this.actionText
        this._toastService.showSuccess(res.msg)
        this.dialogRef.close();
      }, (error) => {
        this.btnText = this.actionText
        this._toastService.showErrorToastr(error ? error.message ?
          error.message : JSON.stringify(error) :
          "Something went wrong!",
        )
      });
  }


  deleteSubject(subject: any) {
    this._confirmationService.open({
      message: `<div>Are you sure you want to confirm this action?</div>
    <div>Added subject will be removed!</div>`
    }).afterClosed().pipe(take(1),
      filter((result) => result),
      switchMap((response) => {
        return this._classService.removeSubject(this.classObj.id, subject);
      }),
      map(el => {
        this._toastService.showSuccess("Removed successfully")
      })
    )
      .subscribe();
  }

  editSubject(subject) {
    this._matDialog.open(EditSubjectComponent, {
      data: subject
    }).afterClosed().pipe(take(1), filter((result) => result), switchMap((response) => {
      return this._classService.editSubject(this.classObj.id, response);

    }), map(el => {
      this._toastService.showSuccess("Updated successfully")
    })).subscribe()
  }
}




@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html',
  styleUrls: ['./add-edit-class.component.scss']
})
export class EditSubjectComponent implements OnInit {
  subject: any = { id: "", name: "", amount: 99, offer_price: 0 };
  ngOnInit(): void {
    this.data.offer_price = this.data.offer_price ? this.data.offer_price : 0;
    this.subject = JSON.parse(JSON.stringify(this.data));

  }
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditSubjectComponent>) {

  }
  submit() {
    var returnData = this.subject
    // if (this.subject.name.toUpperCase() == this.data.name.toUpperCase())
    //   returnData = null
    this.dialogRef.close(returnData)
  }

}