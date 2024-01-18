import { InjectionToken, WritableSignal } from "@angular/core";

/** Interface defining the contract for a SignalInputModifier
 * Extend and modify the behavior of the 'SignalInputDirective' by providing custom implementation of the 'SignalInputModifier' interface
 * These modifiers can be injected into the directive using the 'SIGNAL_INPUT_MODIFIER' token
 */
export interface SignalInputModifier {
  /** Method to handle changes in the ngModel value */
  onModelChange(value: unknown): void

  /** Method to register a WritableSignal */
  registerValueSignal(signal: WritableSignal<unknown>): void;
}

/** Injection token to provide instances of SignalInputModifier */
export const SIGNAL_INPUT_MODIFIER = new InjectionToken<SignalInputModifier>('Custom signal input modifier');
