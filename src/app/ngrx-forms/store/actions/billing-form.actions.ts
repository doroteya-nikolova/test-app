import { Action } from "@ngrx/store";
import { BillingType } from "src/app/shared/constants";
import { InsuranceForm } from "src/app/shared/models";

export class SetBillingTypeAction implements Action {
  static readonly TYPE = 'billingForm/SET_BILLING_TYPE_VALUE';
  readonly type = SetBillingTypeAction.TYPE;
  constructor(public billingTypeValue: BillingType) { }
}

export class SetInsuranceAsPrimaryAction implements Action {
  static readonly TYPE = 'billingForm/SET_INSURANCE_AS_PRIMARY';
  readonly type = SetInsuranceAsPrimaryAction.TYPE;
  constructor(public index: number, public isPrimary: boolean) { }
}

export class ClearInsurancesAction implements Action {
  static readonly TYPE = 'billingForm/CLEAR_INSURANCES';
  readonly type = ClearInsurancesAction.TYPE;
  constructor() { }
}

export class AddInsurancesAction implements Action {
  static readonly TYPE = 'billingForm/ADD_INSURANCES';
  readonly type = AddInsurancesAction.TYPE;
  constructor(public value: InsuranceForm[], public clearPrevious: boolean) { }
}