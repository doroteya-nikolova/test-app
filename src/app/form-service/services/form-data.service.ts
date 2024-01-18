import { FormBuilder, FormGroup } from '@angular/forms';
import { cloneDeep } from 'lodash';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { first } from 'rxjs/operators';

import { FormUtil } from '../form-helpers/form-util.helper';
import { generateBEObject } from '../form-helpers/mapper';
import { AdapterMapper, FieldMapper, MappingConfig, mapNestedProperty } from '../form-helpers/types';

/** Handle form-related functionality with a focus on abstracting common form-related operations and handling error responses  */
/**
 * @Т - Representing the types of BE data
 * @U - representing the types of FE data 
 */
export abstract class FormDataService<T, U> {
  protected form?: FormGroup;

  /** Managing observables associated with forms */
  protected subjects?: {
    [key: string]: Subject<any>;
  };

  /** Indicating whether the form is ready */
  isFormReady = new BehaviorSubject<boolean>(false);

  protected abstract get initialForm(): any;
  protected abstract get initialSubjects(): { [key: string]: Subject<any> };

  constructor(protected fb: FormBuilder) {
    this.initializeSubjects();
    this.initializeForm();
  }

  /** Returns a FormGroup associated with the form data */
  getForm(): FormGroup | undefined {
    return this.form;
  }

  /** Returns a deep clone of the current form value  */
  getFormValue(): U {
    return cloneDeep(this.form?.value);
  }

  generateMappingConfig(backendData: T, config:MappingConfig<T>, excludedProperties?: string[]): U {
    return mapNestedProperty<T, U>(backendData, config, excludedProperties);
  }

  /**
   * 
   * @returns - an observable to emits 'true' when the form is ready
   */
  whenFormIsReady(): Observable<boolean> {
    return this.isFormReady.pipe(first(ready => ready));
  }

  isFormValid(): boolean | undefined{
    return this.form?.valid;
  }

  getSectionFormGroup(name: keyof U & string): FormGroup {
    return this.form?.get(name) as FormGroup;
  }

  /**
   * Sets form group in form. Optionally can patch previous values.
   * @param name Name for the FormGroup
   * @param group FormGroup instance
   * @param [keepValues] `false` by default. Calls `patchValue` method if true to keep previous values of the existing `FormGroup`
   */
  setSectionFormGroup(name: keyof U & string, group: FormGroup, keepValues = false): void {
    const existingGroup = this.getSectionFormGroup(name);
    this.form?.setControl(name, group);

    if (keepValues && existingGroup) {
      this.getSectionFormGroup(name).patchValue(existingGroup.value);
    }
  }

  
  getSubject(name: string) {
    return this.subjects?.[name];
  }

  getDataForSubmit(fieldMapper: FieldMapper<T, U>, adapterMapper: AdapterMapper<T>): T {
    return generateBEObject<T, U>(this.getForm() as FormGroup, fieldMapper, adapterMapper);
  }

  // TODO add errorResponse model
  processErrorsOnSubmit(errorResponse: any, fieldMapper: FieldMapper<T, U>): void {
    FormUtil.processErrorsOnForm<T, U>(errorResponse, this.getForm() as FormGroup, fieldMapper);
  }

  resetData(): void {
    this.restoreSubjects();
    this.initializeForm();
  }

  /** Initializes the form, resetting to its initial state  */
  private initializeForm(): void {
    this.isFormReady.next(false);

    if (this.form) {
      this.form.reset({}, { emitEvent: false });
    } else {
      this.form = this.fb.group(this.initialForm);
    }
  }

  private initializeSubjects() {
    this.subjects = this.initialSubjects;
  }

  /** Restores subject values to their initial state  */
  private restoreSubjects() {
    //* Restoring BehaviourSubject values
    if (this.subjects) {
      Object.keys(this.subjects).forEach(subjKey => {
        const initialSubject = this.initialSubjects[subjKey];
  
        if (initialSubject instanceof BehaviorSubject) {
          this.subjects?.[subjKey].next(initialSubject.value);
        }
      });
    }
  }
}
