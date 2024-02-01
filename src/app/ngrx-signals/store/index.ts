import { provideState } from '@ngrx/store';
import { billingFeature } from './ngrx-signals.reducer';

export const provideBilling = () => [
  provideState(billingFeature),
];
