import { inject, InjectionToken, Provider } from '@angular/core';
import { FormGroup } from './form-group';
import { FormField } from './form-field';

// Define an Injection token for Injectable forms, which can be either a FormGroup or FormField
/**
 * InjectionToken is a class that represents a token used in the dependency injection system. It is a way to define a 
  way to define a unique identifier for a dependency

* INJECTABLE_SIGNAL_FORM - creates an instance of 'InjectionToken: It is used o define an injectable token that can represent either 
* @Usage - when you use 'provideSignalForm' to provide the form at a higher level in the DI hierarchy (like in a module 'providers' array),
Angular will be able to inject the form, using 'injectSignalForm' in components or services that need it
*/
export const INJECTABLE_SIGNAL_FORM = new InjectionToken<FormGroup | FormField>(
  'ng-signal-forms injectable form'
);

/**
 * This function generates an injectable signal form
 * @param formCreator - accepts a function to create a form (either Form Group or Form Control)
 * @returns 
 */
export const createInjectableSignalForm = <
  Form extends FormGroup<any> | FormField<any>
>(
  formCreator: () => Form
) => {
  /**
   * 
   * @returns Provider object, which is a configuration object for the Angular DI system. It specifies that when a component
   * or service request the injection of the 'INJECTABLE_SIGNAL_FORM'
   * Angular should use the provided 'formCreator' function to create the actual form instance
   */
  const provideSignalForm = (): Provider => ({
    provide: INJECTABLE_SIGNAL_FORM,
    useFactory: () => formCreator(),
  });

  /**
   * This function uses 'inject' function to request the injection of 'INJECTABLE_SIGNAL_FORM' in a component or service
   * @returns the instance of the form created by the 'formCreator'
   */
  const injectSignalForm = () =>
    inject(
      INJECTABLE_SIGNAL_FORM as InjectionToken<ReturnType<typeof formCreator>>
    );

  return { provideSignalForm, injectSignalForm };
};
