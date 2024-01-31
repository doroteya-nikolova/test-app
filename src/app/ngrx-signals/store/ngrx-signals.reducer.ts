import { Action, combineReducers, createFeature, createReducer, on } from "@ngrx/store";
import { BillingType } from "src/app/shared";
import { InsuranceForm } from "src/app/shared/models";
import { billingFormActions, billingTypeActions } from "./ngrx-signals.actions";
import { generateRandomId, initialInsurancePlan } from 'src/app/shared';
import { State as RootState } from '../../app.reducer';
import { formStateReducer } from "src/app/ngrx-forms/store/reducers/billing-form.reducer";



export interface State extends RootState {
  signalsBillingForm: {
    formState: BillingFormState;
    billing: BillingState;
  };
}

/**
 * FORM STATE
 */

export const createInitialInsurancePlan = () => ({
  ...initialInsurancePlan,
  id: generateRandomId(),
});

export interface FormValue {
  billingType: BillingType;
  insurances: InsuranceForm[];
  workCompensations: any[];
  personalInjuries: any[];
}

export interface BillingFormState {
  formState: FormValue;
}

export const initialForm: BillingFormState = {
  formState: {
    billingType: BillingType.Insurance,
    insurances: [{ ...createInitialInsurancePlan() }],
    workCompensations:[],
    personalInjuries: []
  }
}
/**
 * BILLING STATE
 */
export interface BillingState {
  billingType: BillingType;
  insurances: InsuranceForm[];
  workCompensations: any[];
  personalInjuries: any[];
}

export const initialState: BillingState = {
  billingType: BillingType.Insurance,
  insurances: [],
  workCompensations:[],
  personalInjuries: []
};

export const billingFeature = createFeature({
  name: 'billing',
  reducer: createReducer<BillingState>(
    initialState,
    on(
      billingTypeActions.load,
      (state): BillingState => ({
        ...state,
      }),
    ),
    on(
      billingTypeActions.loadSuccess,
      (state, { billingType }): BillingState => ({
        ...state,
        billingType,
      }),
    ),
  ),
});

export const formFeature = createFeature({
  name: 'signalsBillingForms',
  reducer: createReducer<BillingFormState>(
    initialForm,
    on(
      billingFormActions.changeForm,
      (state, { payload }) => ({
        ...state,
        ...payload
      }),
    ),
    on(
      billingFormActions.reset,
      (state) => ({
        ...state
      }),
    )
  )
});

export const reducers = combineReducers<State['signalsBillingForm']>({
  formState: formFeature.reducer,
  billing: billingFeature.reducer
});

export function reducer(s: State['signalsBillingForm'], a: Action) {
  return reducers(s, a);
}
