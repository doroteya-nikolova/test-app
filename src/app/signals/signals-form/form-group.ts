import {computed, Injector, isSignal, Signal, WritableSignal} from '@angular/core';
import {DirtyState, FormField, TouchedState} from './form-field';
import {
  computeErrors,
  computeErrorsArray,
  computeState,
  computeValidateState,
  computeValidators,
  InvalidDetails,
  ValidationState,
  Validator,
} from './validation';
import { cloneDeep } from 'lodash';
import { createInsurance } from '../billing-details/billing-form.form';

/**
 * Define the unwrapped structure of a FormGroup, extracting the values of form fields
 */
export type UnwrappedFormGroup<Controls> = {
  [K in keyof Controls]: Controls[K] extends FormField<infer V>
    ? V
    : Controls[K] extends FormGroup<infer G>
      ? UnwrappedFormGroup<G>
      : never;
};

/**
 * Define the structure of the Form Group
 */
export type FormGroup<
  Controls extends | { [p: string]: FormField | FormGroup }
    | WritableSignal<any[]> = {}
> = {
  value: Signal<UnwrappedFormGroup<Controls>>; // The value of the form group 
  controls: { [K in keyof Controls]: Controls[K] }; // the controls within the form group
  valid: Signal<boolean>; //Signal indicating if the group is valid
  state: Signal<ValidationState>; // Validation state of the group 
  dirtyState: Signal<DirtyState>; // Dirty state of the group
  touchedState: Signal<TouchedState>; // Touched state of the group
  errors: Signal<{}>; //Error associated with the group 
  errorsArray: Signal<InvalidDetails[]>; // Errors in an array format 
  markAllAsTouched: () => void; // Function to mark all fields in the group as touched
  reset: () => void; //Function to reset the group to its initial state
  addNewArrayItem: (items?: any) => void;
};

/**
 * Define options that can be passed when creating a form group
 */
export type FormGroupOptions = {
  validators?: Validator<any>[]; // Validators to apply to the groups
  hidden?: () => boolean; // Function to determine if the group should be hidden
  disabled?: () => boolean;  // Function to determine if the group should be disabled
};

/**
 * Utility function to mark a form control as touched
 * @param f 
 */
const markFormControlAsTouched = (f: any) => {
  if (typeof f.markAsTouched === "function") {
    f.markAsTouched();
  }
  if (typeof f.markAllAsTouched === "function") {
    f.markAllAsTouched();
  }
}

/**
 * Create a form group
 * @param formGroupCreator - function to create a form group
 * @param options - optional options for the group
 * @param injector 
 * @returns 
 */
export function createFormGroup<
  Controls extends | { [p: string]: FormField | FormGroup }
    | WritableSignal<any[]>
>(
  formGroupCreator: () => Controls,
  options?: FormGroupOptions,
  injector?: Injector
): FormGroup<Controls> {
  const formGroup = formGroupCreator();
  const initialArrayControls =
    typeof formGroup === 'function' && isSignal(formGroup) ? cloneDeep(formGroup().map(x => x)) : [];

  const valueSignal = computed(() => {
    const fg =
      typeof formGroup === 'function' && isSignal(formGroup)
        ? formGroup()
        : formGroup;

    if (Array.isArray(fg)) {
      return fg.map((f) => f.value());
    }
    return Object.entries(fg).reduce((acc, [key, value]) => {
      (acc as any)[key] = value.value();
      return acc;
    }, {} as any);
  });


  const validatorsSignal = computeValidators(valueSignal, options?.validators, injector);
  const validateStateSignal = computeValidateState(validatorsSignal);

  const errorsSignal = computeErrors(validateStateSignal);
  const errorsArraySignal = computeErrorsArray(validateStateSignal);

  const stateSignal = computeState(validateStateSignal);

  const fgStateSignal = computed(() => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;
      const states = Object.values(fg)
        .map((field) => field.state())
        .concat(stateSignal());
      if (states.some((state) => state === 'INVALID')) {
        return 'INVALID';
      }
      if (states.some((state) => state === 'PENDING')) {
        return 'PENDING';
      }
      return 'VALID';
    });

  return {
    value: valueSignal,
    controls: formGroup,
    state: fgStateSignal,
    valid: computed(() => fgStateSignal() === 'VALID'),
    errors: computed(() => {
      return errorsSignal();
    }),
    errorsArray: computed(() => {
      const myErrors = errorsArraySignal();
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;
      const childErrors = Object.entries(fg).map(([key, f]) => {
        return (f as any)
          .errorsArray()
          .map((e: any) => ({...e, path: e.path ? key + '.' + e.path : key}));
      });
      return myErrors.concat(...childErrors);
    }),
    dirtyState: computed(() => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;

      const states = Object.values(fg).map((f) => f.dirtyState());

      const isDirty = states.some((e) => e === 'DIRTY');
      if (isDirty) {
        return 'DIRTY';
      }

      return 'PRISTINE';
    }),
    touchedState: computed(() => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;

      const states = Object.values(fg).map((f) => f.touchedState());

      const isTouched = states.some((e) => e === 'TOUCHED');
      if (isTouched) {
        return 'TOUCHED';
      }

      return 'UNTOUCHED';
    }),
    markAllAsTouched: () => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;

      if (Array.isArray(fg)) {
        fg.forEach(f => markFormControlAsTouched(f))
        return;
      }
      Object.values(fg).forEach(f => markFormControlAsTouched(f))
    },
    reset: () => {
      const fg =
        typeof formGroup === 'function' && isSignal(formGroup)
          ? formGroup()
          : formGroup;

      if (Array.isArray(fg)) {
        // need to create new array to set so change is not swallowed by equality of objects
        (formGroup as WritableSignal<any[]>).set([...initialArrayControls]);
        return;
      }
      return Object.values(fg).forEach(f => {
        f.reset()
      })
    },
    addNewArrayItem: (items?: any) => {
      const fg =
      typeof formGroup === 'function' && isSignal(formGroup)
        ? formGroup()
        : formGroup;

      if (Array.isArray(fg)) {
        // need to create new array to set so change is not swallowed by equality of objects
        (formGroup as WritableSignal<any[]>).update(update => [...update, ...initialArrayControls]);
        return;
      }
    }
  };
}
