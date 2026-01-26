import { Component, OnInit } from '@angular/core';
import { ClassesService } from '../services/classes.service';
import { MatDialog } from '@angular/material/dialog';
import { AddEditClassComponent } from '../add-edit-class/add-edit-class.component';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation.service';
import { filter, map, switchMap, take } from 'rxjs';
import { ToastService } from '@app/shared/services/toast/toast.service';

@Component({
  standalone: false,
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {

  constructor(public classService: ClassesService,
    private _confirmationService: ConfirmationService,
    private _matDialog: MatDialog,
    private _toastService: ToastService,) {

  }


  ngOnInit(): void {

  }

  addOrEdit(clss?: any) {
    if (clss) {
      this.classService.getSubjects(clss.id).pipe(take(1),).subscribe();
    }
    else
      this.classService.subjects = [];

    return this._matDialog.open(AddEditClassComponent, {
      autoFocus: false,
      data: clss,
      height: 'auto',
      width: '700px',
    });
  }

  delete(event: any) {
    this._confirmationService.open().afterClosed().pipe(take(1),
      filter((result) => result),
      switchMap((response) => {
        return this.classService.deleteClass(event.name);
      }),
      map(el => {
        this._toastService.showSuccess("Removed successfully")
      })
    )
      .subscribe();
  }

}
