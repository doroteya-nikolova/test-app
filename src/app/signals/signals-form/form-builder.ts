import { inject, Injectable, Injector, WritableSignal } from "@angular/core";
import { FormField, createFormField, FormFieldOptions, FormFieldOptionsCreator } from "./form-field";
import { FormGroup, createFormGroup,FormGroupOptions } from "./form-group";
/**
 * Creating form fields and form groups in a reactive manner using WritableSignal
 */
@Injectable({
  providedIn: 'root'
})
export class SignalFormBuilder {
  private injector = inject(Injector);

  /**
   * Creates a Form FIeld, which represent a single form field, I t
   * @param value 
   * @param options - optional, define the behavior of the form fields
   * @returns 
   */
  createFormField<Value>(
    value: Value | WritableSignal<Value>,
    options?: FormFieldOptions | FormFieldOptionsCreator<Value>,
  ): FormField<Value> {
    return createFormField(value, options, this.injector);
  }

  /**
   * Represents a group of form fields
   * @param formGroupCreator - defines the structure of the form group by specifying the controls (form fields and nested form groups)
   * @param options - configuring the form group's behavior
   * @returns 
   */
  createFormGroup<
    Controls extends | { [p: string]: FormField | FormGroup }
      | WritableSignal<any[]>
  >(
    formGroupCreator: () => Controls,
    options?: FormGroupOptions
  ): FormGroup<Controls> {
    return createFormGroup(formGroupCreator, options, this.injector);
  }
}
