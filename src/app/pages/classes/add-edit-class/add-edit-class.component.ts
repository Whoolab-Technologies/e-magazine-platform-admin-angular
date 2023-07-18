import { Component, Inject, OnInit } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ClassesService } from '../services/classes.service';
import { catchError, map, tap } from 'rxjs';
import { ToastService } from '@app/shared/services/toast/toast.service';

@Component({
  selector: 'app-add-edit-class',
  templateUrl: './add-edit-class.component.html',
  styleUrls: ['./add-edit-class.component.scss']
})
export class AddEditClassComponent implements OnInit {
  btnDisabled: boolean = false;
  isEdit: boolean = false;
  btnText: string = "Submit";
  actionText: string = "Submit";
  subjects: any[] = [];
  classObj: any = {}
  subject: any = { id: "", name: "", amount: 99 };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _classService: ClassesService,
    private _toastService: ToastService,
    private dialogRef: MatDialogRef<AddEditClassComponent>
  ) {

  }

  ngOnInit(): void {
    this.classObj = this.data || {};
    if (this.data) {
      this.btnText = "Update";
      this.isEdit = true
    }
    this.actionText = this.btnText;
    this._classService.subjects$.pipe(map((subjects) => {
      var subj = []
      if (subjects.length) {
        subj = [...subjects];
        if (subjects.length < 4) {
          var temp = []
          for (let index = 0; index < 4 - subjects.length; index++) {
            console.log(index);
            // this.subject.id = index;
            console.log("   this.subject.id  ", this.subject.id)
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

    const subjects = this.subjects.filter(el => el.name && el.amount && el.amount > 0)
    if (!this.classObj.name || !subjects.length) {
      this._toastService.showInfoToastr("All Fields Are Required");
    }
    this.btnText = "Please wait...";
    this.btnDisabled = true
    this._classService.addOrUpdate(this.classObj, subjects, this.isEdit)
      .pipe(tap((resp: any) => {
        return resp;
      })).subscribe((res: any) => {
        this.btnDisabled = false;
        this.btnText = this.actionText
        this._toastService.showSuccess(res.msg)
        this.dialogRef.close();
      }, (error) => {
        console.log('errror=> error ', error);
        this.btnText = this.actionText
        this._toastService.showErrorToastr(error ? error.message ?
          error.message : JSON.stringify(error) :
          "Something went wrong!",
        )
      });
  }


}
