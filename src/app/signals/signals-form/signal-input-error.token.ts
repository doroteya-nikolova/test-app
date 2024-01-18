import {InjectionToken, Provider, Type} from "@angular/core";

export const SIGNAL_INPUT_ERROR_COMPONENT = new InjectionToken<Type<unknown>>('Custom signal error component');

/**
 * Create a token for custom signal error component. It also includes a utility function 
 * 'withErrorComponent' that provides a custom component for the given token
 */
export const withErrorComponent = (customComponent: Type<unknown>): Provider => ({
  provide: SIGNAL_INPUT_ERROR_COMPONENT,
  useValue: customComponent
})


