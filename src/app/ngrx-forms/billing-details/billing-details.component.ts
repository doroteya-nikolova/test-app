import { Component } from '@angular/core';
import { FormValue, State } from '../store/reducers/billing-form.reducer';
import { Store, select } from '@ngrx/store';
import { FormGroupState, SetValueAction, Actions } from 'ngrx-forms';
import { Observable } from 'rxjs';
import { SetBillingTypeAction } from '../store/actions/billing-form.actions';

import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';

import { BillingType } from 'src/app/shared/constants';

export interface BillingOption {
  value: BillingType;
  text: string;
}

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrls: ['./billing-details.component.scss'],
})
export class BillingDetailsComponent {
  formState$: Observable<FormGroupState<FormValue>>;
  billingType$: Observable<BillingType>;

  isFormLoading = true;
  billingType = BillingType;
  billingTypeOptions: BillingOption[] = [
    {
      value: BillingType.SelfPay,
      text: "Self-pay"
    },
    {
      value: BillingType.Insurance,
      text: "Insurance"
    },
    {
      value: BillingType.WorkerCompensation,
      text: "Workers' comp"
    },
    {
      value: BillingType.PersonalInjury,
      text: "Personal injury"
    },
    {
      value: BillingType.External,
      text: "Client bill"
    },
    {
      value: BillingType.NonBillable,
      text: "Non-billable"
    }
  ];

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.billingForm.formState));
    this.billingType$ = store.pipe(select(s => s.billingForm.billingType));
  }

  switchBillingType(action: Actions<any>): void {
    if (action.type === SetValueAction.TYPE) {
      this.store.dispatch(new SetBillingTypeAction(action.value));
    }
  }

  findTextByValue(selectedValue: string): string {
    return this.billingTypeOptions.find((b) => b.value === selectedValue)?.text || '';
  }

  formattedFormState(formState: FormGroupState<FormValue>): string {
    const formStateJson = JSON.stringify(formState, null, 2);
    return Prism.highlight(formStateJson, Prism.languages['json'], 'en');
  }
}
