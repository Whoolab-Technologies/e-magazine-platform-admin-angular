import { Injectable } from '@angular/core';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { ConfirmationComponent } from '@app/shared/confirmation/confirmation.component';
import { ConfirmationConfig } from '@app/shared/model/confirmation-config';

@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  private _defaultConfig: ConfirmationConfig = {
    title: 'Confirm Delete',
    message: 'Are you sure you want to confirm this action?',
    icon: {
      show: true,
      name: 'warning',
      color: 'warn',
    },
    actions: {
      confirm: {
        show: true,
        label: 'Confirm',
        color: 'warn',
      },
      cancel: {
        show: true,
        label: 'Cancel',
      },
    },
    dismissible: false,
  };



  /**
   * Constructor
   */
  constructor(private _matDialog: MatDialog) { }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  open(
    config: ConfirmationConfig = {}
  ): MatDialogRef<ConfirmationComponent> {
    // Merge the user config with the default config
    const userConfig = { ...this._defaultConfig, ...config };

    // Open the dialog
    return this._matDialog.open(ConfirmationComponent, {
      autoFocus: false,
      disableClose: !userConfig.dismissible,
      data: userConfig,
    });
  }
}


