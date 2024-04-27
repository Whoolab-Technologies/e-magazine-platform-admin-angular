import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors, NgModel } from '@angular/forms';

@Directive({
  selector: '[appEmailValidator][ngModel]',
  providers: [
    { provide: NG_VALIDATORS, useExisting: EmailValidatorDirective, multi: true }
  ]
})
export class EmailValidatorDirective implements Validator {
  constructor() { }

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (!value) {
      return null; // Return null if the control is empty
    }

    // Email regex pattern for basic email validation
    const emailRegex: RegExp = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(value)) {
      return { 'invalidEmail': true }; // Return an error if the email format is invalid
    }

    return null; // Return null if the email format is valid
  }
}