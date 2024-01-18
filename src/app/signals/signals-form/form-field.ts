import {computed, effect, Injector, isSignal, signal, Signal, WritableSignal} from '@angular/core';
import {
  computeErrors,
  computeErrorsArray,
  computeState,
  computeValidateState,
  computeValidators,
  InvalidDetails,
  ValidationErrors,
  ValidationState,
  Validator,
} from './validation';

/**
 * Define the possible state of the form field
 */
export type DirtyState = 'PRISTINE' | 'DIRTY';
export type TouchedState = 'TOUCHED' | 'UNTOUCHED';

/**
 * Define the structure of the form field
 */
export type FormField<Value = unknown> = {
  value: WritableSignal<Value>; // The value of the form fields
  errors: Signal<ValidationErrors>; // Errors associated with form fields 
  errorsArray: Signal<InvalidDetails[]>; // Errors in an array format
  state: Signal<ValidationState>; // Validation state of the form field
  valid: Signal<boolean>; // Signal indicating if the field is valid
  dirtyState: Signal<DirtyState>; // Dirty state of the form field
  touchedState: Signal<TouchedState>; // Touched state of the form field
  hidden: Signal<boolean>; // Signal indicating if the form field is hidden
  disabled: Signal<boolean>; // Signal indicating if the field is disabled
  markAsTouched: () => void; //Function to mark the field as touched
  markAsDirty: () => void; // Function to mark the field as dirty
  reset: () => void; // Function to reset the fields its default value 
  registerOnReset: (fn: (value: Value) => void) => void // Function to register a callback for field reset
};

/**
 * Define options that can be passed when creating a form field
 */
export type FormFieldOptions = {
  validators?: Validator<any>[]; // validators to apply to the field
  hidden?: () => boolean; // Function to determine if the field should be hidden
  disabled?: () => boolean; // Function to determine if the field should be disabled
};
export type FormFieldOptionsCreator<T> = (value: Signal<T>) => FormFieldOptions

/**
 * Create a form field
 * @param value - initial value or a signal for the field's value
 * @param options - optional options
 * @param injector 
 * @returns 
 */
export function createFormField<Value>(
  value: Value | WritableSignal<Value>,
  options?: FormFieldOptions | FormFieldOptionsCreator<Value>,
  injector?: Injector
): FormField<Value> {
  const valueSignal =
    // needed until types for writable signal are fixed
    (typeof value === 'function' && isSignal(value) ? value : signal(value)) as WritableSignal<Value>;
  const finalOptions = options && typeof options === 'function' ? options(valueSignal) : options;

  const validatorsSignal = computeValidators(valueSignal, finalOptions?.validators, injector);
  const validateStateSignal = computeValidateState(validatorsSignal);

  const errorsSignal = computeErrors(validateStateSignal);
  const errorsArraySignal = computeErrorsArray(validateStateSignal);

  const stateSignal = computeState(validateStateSignal);
  const validSignal = computed(() => stateSignal() === 'VALID')

  const touchedSignal = signal<TouchedState>('UNTOUCHED');
  const dirtySignal = signal<DirtyState>('PRISTINE');
  const hiddenSignal = signal(false);
  const disabledSignal = signal(false);

  // Effects to manage touched, dirty, hidden, and disabled states
  effect(() => {
    if (valueSignal()) {
      dirtySignal.set('DIRTY');
    }
  }, {
    allowSignalWrites: true,
    injector: injector
  });

  if (finalOptions?.hidden) {
    effect(() => {
        hiddenSignal.set(finalOptions!.hidden!());
      },
      {
        allowSignalWrites: true,
        injector: injector
      });
  }

  if (finalOptions?.disabled) {
    effect(() => {
        disabledSignal.set(finalOptions!.disabled!());
      },
      {
        allowSignalWrites: true,
        injector: injector
      });
  }

  /**
   * Define the default value and callback for field reset
   */
  const defaultValue = typeof value === 'function' && isSignal(value) ? value() :value;
  let onReset = (value: Value) => {}

  return {
    value: valueSignal,
    errors: errorsSignal,
    errorsArray: errorsArraySignal,
    state: stateSignal,
    valid: validSignal,
    touchedState: touchedSignal,
    dirtyState: dirtySignal,
    hidden: hiddenSignal,
    disabled: disabledSignal,
    markAsTouched: () => touchedSignal.set('TOUCHED'),
    markAsDirty: () => dirtySignal.set('DIRTY'),
    registerOnReset: (fn: (value: Value) => void) => onReset = fn,
    reset: () => {
      valueSignal.set(defaultValue);
      touchedSignal.set('UNTOUCHED');
      dirtySignal.set('PRISTINE');
      onReset(defaultValue);
    }
  };
}
