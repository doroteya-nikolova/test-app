import { Component } from '@angular/core';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';

import { BillingType } from 'src/app/shared/constants';
import { injectSignalForm } from './billing-form.form';

export interface BillingOption {
  value: BillingType;
  text: string;
}

@Component({
  selector: 'app-billing-details',
  templateUrl: './billing-details.component.html',
  styleUrls: ['./billing-details.component.scss']
})
export class BillingDetailsComponent {
  form = injectSignalForm();
  billingTypeForm = injectSignalForm().controls.billingType;

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

  constructor() {}

  switchBillingType(): void {
  }

  findTextByValue(selectedValue: string): string {
    return this.billingTypeOptions.find((b) => b.value === selectedValue)?.text || '';
  }

  formattedFormState(): string {
    const formStateJson = JSON.stringify(this.form.value(), null, 2);
    return Prism.highlight(formStateJson, Prism.languages['json'], 'en');
  }
}
