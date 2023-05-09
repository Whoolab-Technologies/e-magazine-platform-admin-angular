import { Injectable } from '@angular/core';
import { ErrorToastrComponent, InfoToastrComponent, SuccessToastComponent } from '@app/pages/notification/containers';
import { ToastrService } from 'ngx-toastr';
enum ToastPositionTypes {
  bottomCenter = 'toast-bottom-center',
  bottomRight = 'toast-bottom-right',
  bottomLeft = 'toast-bottom-left',
  topCenter = 'toast-top-center',
  topRight = 'toast-top-right',
  topLeft = 'toast-top-left'
}
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toastrPositionTypes: typeof ToastPositionTypes = ToastPositionTypes;
  toastrPosition: string = this.toastrPositionTypes.bottomCenter;
  timeOut = 3000;
  constructor(private toastrService: ToastrService) { }

  public showSuccess(message: string): void {
    this.toastrService.show(
      message,
      "null",
      {
        positionClass: this.toastrPosition,
        toastComponent: SuccessToastComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }

  public showErrorToastr(message: string): void {
    this.toastrService.show(
      message,
      null,
      {
        positionClass: this.toastrPosition,
        toastComponent: ErrorToastrComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }

  public showInfoToastr(message: string): void {
    this.toastrService.show(
      message,
      null,
      {
        positionClass: this.toastrPosition,
        toastComponent: InfoToastrComponent,
        timeOut: this.timeOut,
        tapToDismiss: false
      }
    );
  }
}

