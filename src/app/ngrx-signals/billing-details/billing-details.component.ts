import { Component, inject } from '@angular/core';
import { FormsModule, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import * as Prism from 'prismjs';
import { BillingDetailsInsurancesComponent } from './billing-details-insurances/billing-details-insurances.component';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NgIf, NgFor } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import { NgRxSignalsStore } from '../store/ngrx-signals.store';

export enum BillingType {
  SelfPay = 'billingType.selfPay',
  Insurance = 'billingType.insurance',
  WorkerCompensation = 'billingType.workersComp',
  PersonalInjury = 'billingType.personalInjury',
  External = 'billingType.external',
  NonBillable = 'billingType.nonBillable',
}

export interface BillingOption {
  value: BillingType;
  text: string;
}

@Component({
    selector: 'app-billing-details',
    templateUrl: './billing-details.component.html',
    styleUrls: ['./billing-details.component.scss'],
    standalone: true,
    imports: [
      MatCardModule,
      NgIf,
      MatFormFieldModule,
      MatSelectModule,
      FormsModule,
      ReactiveFormsModule,
      NgFor,
      MatOptionModule,
      BillingDetailsInsurancesComponent,
      MatProgressSpinnerModule
    ],
})
export class BillingDetailsComponent {
  readonly store = inject(NgRxSignalsStore);

  formGroup = inject(NonNullableFormBuilder).group({
    billingType: [this.store.billingType()],
    insurances: [],
  });
 
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

  get billingTypeControl() {
    return this.store.getBillingTypeControl();
  }

  findTextByValue(selectedValue: string): string {
    return this.billingTypeOptions.find((b) => b.value === selectedValue)?.text || '';
  }

  changeBillingType(type: BillingType): void {
    this.store.changeBillingType(type);
  }

  formattedFormState(): string {
    const formStateJson = JSON.stringify(this.store.formState().value, null, 2);
    return Prism.highlight(formStateJson, Prism.languages['json'], 'en');
  }
}
