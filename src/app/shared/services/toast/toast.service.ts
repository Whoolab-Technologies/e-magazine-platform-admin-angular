import { Injectable } from '@angular/core';
import { ErrorToastrComponent, InfoToastrComponent, SuccessToastComponent } from '@app/pages/notification/containers';
import { ToastrService } from 'ngx-toastr';
import { ToastPositionTypes } from '@app/shared/model/toast'
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastrPositionTypes: typeof ToastPositionTypes = ToastPositionTypes;
  toastrPosition: string = this.toastrPositionTypes.bottomCenter;
  timeOut = 3000;
  constructor(private toastrService: ToastrService) { }

  public showSuccess(message: string, toastrPosition = this.toastrPosition): void {
    this.toastrService.show(
      message,
      null,
      {
        positionClass: toastrPosition,
        toastComponent: SuccessToastComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }

  public showErrorToastr(message: string, toastrPosition = this.toastrPosition): void {
    this.toastrService.show(
      message,
      null,
      {
        positionClass: toastrPosition,
        toastComponent: ErrorToastrComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }

  public showInfoToastr(message: string, toastrPosition = this.toastrPosition): void {
    this.toastrService.show(
      message,
      null,
      {
        positionClass: toastrPosition,
        toastComponent: InfoToastrComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }
}

