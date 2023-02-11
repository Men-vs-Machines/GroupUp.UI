import { AbstractControl, Validators } from '@angular/forms';

export class whiteSpaceValidator {
  public static whiteSpaceValidator: Validators = (
    control: AbstractControl
  ) => {
    if (!control || !control.value) {
      return null;
    }

    const regex = new RegExp(/\s/g);
    if (regex.test(control.value)) {
      return { whitespace: true };
    }

    return null;
  };
}
