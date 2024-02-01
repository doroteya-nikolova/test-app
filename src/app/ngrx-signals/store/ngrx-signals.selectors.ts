import { billingFeature } from "./ngrx-signals.reducer";

const { selectBillingType } = billingFeature;

export const fromBilling = {
  selectBillingType
}