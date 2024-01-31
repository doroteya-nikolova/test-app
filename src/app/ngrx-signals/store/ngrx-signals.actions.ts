import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { BillingType } from 'src/app/shared';

export const billingTypeActions = createActionGroup({
  source: 'Billing Type',
  events: {
    Load: props<{ billingType: BillingType }>(),
    'Load Success': props<{
      billingType: BillingType;
    }>(),
  },
});

export const billingFormActions = createActionGroup({
  source: 'Billing Form',
  events: {
    'Change Form': props<{ payload: any }>(),
    'Reset': emptyProps(),
  },
});
