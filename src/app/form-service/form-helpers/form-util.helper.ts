import {
  AbstractControl,
  AbstractControlOptions,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NgControl
} from '@angular/forms';

import { FieldMapper } from '../form-helpers/types';
import { getViewModelControlFromBEPath } from './mapper';
import { DEFAULT_SHOW_ERRORS_ON, DEFAULT_UPDATE_ON } from './form-util.config';

export class FormUtil {
  constructor(public builder: FormBuilder) {}

  /**
   * Gets updateOn real value of a control
   *
   * Angular by default returns `change` when the property was not set. This method enables us to know if `change`
   * was set in purpose (will return `change`) or not (will return `undefined` if no other value was set).
   *
   * Thanks to this we can decide to have another default `updateOn` property (our global case is `blur`).
   *
   * We need to skip the original getter method of Angular and that is why we access the private property `_updateOn` but
   * we loop through the ancestors (parents) the same way (line 317):
   *
   * https://github.com/angular/angular/blob/master/packages/forms/src/model.ts
   *
   * @param control control to retrieve updateOn property
   * @param defaultUpdateOn optional `updateOn` value
   * @returns app's default value for `updateOn` (`blur`) when it was not set, or current `updateOn` value
   */
  static getUpdateOn(
    control: AbstractControl | NgControl,
    defaultUpdateOn = DEFAULT_UPDATE_ON
  ): 'change' | 'blur' | 'submit' {
    let updateOn;

    if (control) {
      let currentControl = (control as NgControl).control
        ? (control as NgControl).control
        : (control as AbstractControl);

      while (!updateOn && currentControl) {
        updateOn = currentControl['updateOn'];
        currentControl = currentControl.parent;
      }
    }

    return updateOn ? updateOn : defaultUpdateOn;
  }

  /**
   * Gets error message found in control
   * @param ngControl control to be checked
   * @returns error message
   */
  static getErrorMessage(
    ngControl: AbstractControl | NgControl,
    customErrorMessages: any = {}
  ): string {
    let message = '';

    if (ngControl && ngControl.errors) {
      const errors = ngControl.errors;
      const errorType = Object.keys(errors)[0];
      const errorParams = errors[errorType];

      message =
        customErrorMessages[errorType] ||
        errorParams.message ||
        errorParams.key;
    }

    return message;
  }

  /**
   * By default, errors are shown (if any) when control is touched but is not `disabled || locked`
   * @param ngControl control to be checked
   * @param [showErrorsOn] `optional` config indicating to show errors on `dirty` || `touched`. Default is `touched`
   * @param [isLocked] `optional` indicates if control is locked
   * @returns `true` if errors should be shown if any, `false` if not
   */
  static areErrorsShown(
    ngControl: NgControl | AbstractControl,
    showErrorsOn: 'dirty' | 'touched' = DEFAULT_SHOW_ERRORS_ON,
    isLocked?: boolean
  ) {
    return (
      ngControl &&
      !ngControl.disabled &&
      !isLocked &&
      ((showErrorsOn === 'dirty' && ngControl.dirty) ||
        (showErrorsOn === 'touched' && (ngControl.touched || ngControl.dirty)))
    );
  }

  /**
   * Marks every invalid control as `dirty` or `touched` so the validation errors are shown.
   * @param abstractControl it can be `FormControl`, `FormGroup`, `FormArray`
   */
  static showControlState(
    ngControl: NgControl | AbstractControl,
    showErrorsOn: 'dirty' | 'touched' = DEFAULT_SHOW_ERRORS_ON
  ): void {
    const abstractControl: AbstractControl | null = ngControl instanceof NgControl ? ngControl.control : ngControl;

    if (abstractControl instanceof FormGroup) {
      FormUtil.showStatusOfFormGroup(abstractControl);
    }

    if (abstractControl instanceof FormArray) {
      FormUtil.showStatusOfFormArray(abstractControl);
    }

    if (abstractControl instanceof FormControl && abstractControl.invalid) {
      showErrorsOn === 'dirty' ? abstractControl.markAsDirty() : abstractControl.markAsTouched();
    }
  }

  static processErrorsOnForm<T, U>(
    errorResponse: any, // Add error response BE model
    form: FormGroup,
    fieldMapper?: FieldMapper<T, U>
  ): void {
    errorResponse.messages.forEach((item: any) => {
      const messageText = item.message;

      if (item.messageParams.length && item.messageParams[0].name === 'fieldName') {
        const fieldPath = item.messageParams[0].value;
        const viewModelControl = !!fieldMapper
          ? getViewModelControlFromBEPath<T, U>(fieldPath, form, fieldMapper)
          : form.get(fieldPath);

        if (viewModelControl) {
          FormUtil.showControlState(viewModelControl);
          viewModelControl.markAsDirty(); // TODO Remove when custom controls are unified regarding show of errors
          viewModelControl.setErrors({
            backendError: { message: messageText }
          });
        }
      }
    });
  }

  private static showStatusOfFormGroup(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => FormUtil.showControlState(control));
  }

  private static showStatusOfFormArray(formArray: FormArray): void {
    formArray.controls.forEach(control => FormUtil.showControlState(control));
  }

  /**
   * Gets specific abstract control in the specific group
   * @template T Model that will be used to check if `name` is valid
   * @param group Group that contains the `AbstractControl` to retrieve
   * @param name Name of the `AbstractControl`
   * @returns specific abstract control. Could be a `FormGroup`, `FormArray` or `FormControl`
   */
  static get<T>(group: FormGroup, name: Extract<keyof T, string>): AbstractControl | null {
    return group.get(name);
  }

  /**
   * Regularizes controls removing spaces
   * @param controls array of controls to regularize
   */
  static regularizeCalculationControls(...controls: AbstractControl[]): void {
    controls.forEach(control => {
      if (control.value && typeof control.value === 'string') {
        control.setValue(control.value.replace(/[ ]/g, ''), {
          emitEvent: false
        });
      }
    });
  }

  /**
   * Helps creating a form group with an interface as guiding.
   * Using this method every time a Group is created will make easier finding errors if model changes.
   * @template T interface to use as guiding
   * @param groupConfig config passed to FormBuilder group. It could be an `AbstractControl` instance or an `Array` with default value and validators
   * @returns form group
   */
  createGroup<T>(groupConfig: { [key in keyof T]: any }, options?: AbstractControlOptions): FormGroup {
    return this.builder.group(groupConfig, options);
  }
}
