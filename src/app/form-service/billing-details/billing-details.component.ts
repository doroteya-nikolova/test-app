import { Component } from '@angular/core';
import { Subject, takeUntil, map } from 'rxjs';
import { BillingInsuranceDataService } from '../services/billing-form.service';
import { FormControl, FormGroup } from '@angular/forms';
import * as Prism from 'prismjs';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';

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
  providers: [BillingInsuranceDataService]
})
export class BillingDetailsComponent {
  isFormLoading = true;
  form: FormGroup | undefined;
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

  private destroy$ = new Subject();

  constructor(public formData: BillingInsuranceDataService) {}

  ngOnInit(): void {
    this.form = this.formData.getForm();
    this.initializeFormLoadingListener();
  }

  getBillingTypeControl(): FormControl {
    return this.form?.get('billingType') as FormControl;
  }

  getBillingTypeControlSubject() {
    return this.formData.getSubject('billingType');
  }

  findTextByValue(selectedValue: string): string {
    return this.billingTypeOptions.find((b) => b.value === selectedValue)?.text || '';
  }

  private initializeFormLoadingListener(): void {
    this.formData.isFormReady
      .pipe(
        map(ready => !ready),
        takeUntil(this.destroy$)
      )
      .subscribe((loading: boolean) => {
        this.isFormLoading = loading;

      });
  }

  formattedFormState(): string {
    const formStateJson = JSON.stringify(this.formData?.getFormValue(), null, 2);
    return Prism.highlight(formStateJson, Prism.languages['json'], 'en');
  }
}
