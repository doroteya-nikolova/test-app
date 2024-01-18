import { InsuranceForm } from 'src/app/shared/models';
import { State as RootState } from '../../../app.reducer';
import { AddArrayControlAction, FormGroupState, RemoveArrayControlAction, SetValueAction, createFormGroupState, formGroupReducer, setValue, updateGroup } from 'ngrx-forms';
import { combineReducers, Action } from '@ngrx/store';
import { AddInsurancesAction, ClearInsurancesAction, SetBillingTypeAction, SetInsuranceAsPrimaryAction } from '../actions/billing-form.actions';
import { BillingType } from 'src/app/shared/constants';

export interface FormValue {
  billingType: BillingType;
  insurances: InsuranceForm[];
  workCompensations: any[];
  personalInjuries: any[];
}

export interface State extends RootState {
  billingForm: {
    formState: FormGroupState<FormValue>;
    billingType: BillingType;
    insurances: InsuranceForm[];
    workCompensations: any[];
    personalInjuries: any[];
  };
}

export const initialInsurancePlan: InsuranceForm = {
   id: '',
   insurancePlanId: '',
   idNumber: '',
   groupNumber: '',
   policyHolder: {
    label: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    dateOfBirth: '',
    birth: '',
    relation: '',
    sex: 0,
    homePhone: '',
    mobilePhone: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      country: '',
      poBox: '',
      zipCode: ''
    }
   },
   cardFrontId: '',
   cardBackId: '',
   cardFrontDocumentId: '',
   cardBackDocumentId: '',
   examInsurance: {
    eligibility: {
      status: '',
      statusUpdatedOn: '',
      lastStatus: '',
      lastStatusUpdatedOn: ''
    },
    authorization: {
      status: '',
      number: '',
      expirationDate: '',
    },
    examPrice: 0,
    patientOutOfPocket: 0,
    isLoading: false,
    hasError: false,
    errorMessage: ''
   },
   isPrimary: false,
   isActive: true
 }

 function generateRandomId(): string {
  return Math.floor(Math.random() * 100).toString();
}

// Generate a new random ID for each new instance of initialInsurancePlan
export const createInitialInsurancePlan = () => ({
  ...initialInsurancePlan,
  id: generateRandomId(),
});


export const FORM_ID = 'billingForm';

export const INITIAL_STATE = createFormGroupState<FormValue>(FORM_ID, {
  billingType: BillingType.Insurance,
  insurances: [{ ...createInitialInsurancePlan() }],
  workCompensations: [],
  personalInjuries: []
});

const billingTypeReducer = (state = BillingType.Insurance, action: SetBillingTypeAction): BillingType => {
  switch (action.type) {
    case SetBillingTypeAction.TYPE:
      return action.billingTypeValue;

    default:
      return state;
  }
};

const insuranceReducer = (state = INITIAL_STATE.value.insurances, action: AddArrayControlAction<InsuranceForm> | RemoveArrayControlAction | SetInsuranceAsPrimaryAction | ClearInsurancesAction | AddInsurancesAction): any[] => {
  switch (action.type) {
    case AddArrayControlAction.TYPE: {
      const addControlAction = action as AddArrayControlAction<InsuranceForm>;
      return [...state, addControlAction.value];
    }

    case RemoveArrayControlAction.TYPE: {
      const removeControlAction = action as RemoveArrayControlAction;
      const indexToRemove = removeControlAction.index;
      if (indexToRemove !== undefined && indexToRemove >= 0 && indexToRemove < state.length) {
        return [...state.slice(0, indexToRemove), ...state.slice(indexToRemove + 1)];
      }

      return state;
    }

    case SetInsuranceAsPrimaryAction.TYPE: {
      const setInsuranceAsPrimaryAction = action as SetInsuranceAsPrimaryAction;
      const indexToSet = setInsuranceAsPrimaryAction.index;
      if (indexToSet !== undefined && indexToSet >= 0 && indexToSet < state.length) {
        return state
          .map((insurance, index) => indexToSet === index ? { ...insurance, isPrimary: action.isPrimary } : insurance)
      }

      return state;
    }

    case ClearInsurancesAction.TYPE: {
      return INITIAL_STATE.value.insurances;
    }

    case AddInsurancesAction.TYPE: {
      const { clearPrevious, value } = action as AddInsurancesAction;
      return clearPrevious ? [...value] : [...state, ...value];
    }

    default:
      return state;
  }
}

const workCompensationsReducer = (state = INITIAL_STATE.value.workCompensations, action: AddArrayControlAction<any> | RemoveArrayControlAction): any[] => {
  switch (action.type) {
    default:
      return state;
  }
}

const personalInjuriesReducer = (state = INITIAL_STATE.value.personalInjuries, action: AddArrayControlAction<any> | RemoveArrayControlAction): any[] => {
  switch (action.type) {
    default:
      return state;
  }
}

export function formStateReducer(
  state = INITIAL_STATE,
  action: Action | SetBillingTypeAction | AddArrayControlAction<InsuranceForm> | SetInsuranceAsPrimaryAction | AddInsurancesAction,
) {
  switch (action.type) {
    case SetBillingTypeAction.TYPE:
      return updateGroup<FormValue>({
        billingType: value => {
          const { billingTypeValue } = action as SetBillingTypeAction;
          const newBillingType = setValue(value, billingTypeValue);

          return newBillingType
        },
      })(state);

    case AddArrayControlAction.TYPE:
      return updateGroup<FormValue>({
        insurances: insurances => {
          const addControlAction = action as AddArrayControlAction<InsuranceForm>;
          const newInsuranceValue = [ ...insurances.value, addControlAction.value];
          const newArrayValue = setValue(insurances, newInsuranceValue);

          return newArrayValue
        },
      })(state);

    case SetInsuranceAsPrimaryAction.TYPE:
      return updateGroup<FormValue>({
        insurances: insurances => {
          const { index, isPrimary } = action as SetInsuranceAsPrimaryAction;
          if (index !== undefined && index >= 0 && index < insurances.value.length) {
            const newInsuranceValue = insurances.value
              .map((insurance, i) => i === index ? { ...insurance, isPrimary } : insurance);

            const newArrayValue = setValue(insurances, newInsuranceValue);            

            return newArrayValue
          }

          return insurances
        },
      })(state);

    case ClearInsurancesAction.TYPE:
      return updateGroup<FormValue>({
        insurances: insurances => setValue(insurances, INITIAL_STATE.value.insurances),
      })(state);

    case AddInsurancesAction.TYPE:
      return updateGroup<FormValue>({
        insurances: insurances => {
          const { clearPrevious, value } = action as AddInsurancesAction;
          if (clearPrevious) {
            return setValue(insurances, value)
          } else {
            const newInsuranceValue = [ ...insurances.value, ...value];
            return setValue(insurances, newInsuranceValue);
          }
        },
      })(state);
      
  default:
    return formGroupReducer(state, action);
  }
}

const reducers = combineReducers<State['billingForm'], any>({
  formState: formStateReducer,
  billingType: billingTypeReducer,
  insurances: insuranceReducer,
  personalInjuries: personalInjuriesReducer,
  workCompensations: workCompensationsReducer
});

export function reducer(s: State['billingForm'], a: Action) {
  return reducers(s, a);
}