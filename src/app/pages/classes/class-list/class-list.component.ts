import { Component, OnInit } from '@angular/core';
import { ClassesService } from '../services/classes.service';
import { ConfirmationService } from '@app/shared/services/confirmation/confirmation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastService } from '@app/shared/services/toast/toast.service';

@Component({
  selector: 'app-class-list',
  templateUrl: './class-list.component.html',
  styleUrls: ['./class-list.component.scss']
})
export class ClassListComponent implements OnInit {

  constructor(public classService: ClassesService,
    private _router: Router,
    private _confirmationService: ConfirmationService,
    private _toastService: ToastService,
    private _route: ActivatedRoute) {

  }
  ngOnInit(): void {

  }

  addOrEdit(clss?: any) {
    this._router.navigate(['./', clss ? clss.id : 'new'], { relativeTo: this._route })
  }

  delete(clss: any) {
    console.log(clss);
  }

}
