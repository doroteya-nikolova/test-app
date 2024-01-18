import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InsuranceForm } from 'src/app/shared/models';
import { createInsurance, injectSignalForm, provideSignalForm } from '../billing-form.form';
import { CustomErrorComponent } from 'src/app/shared/components/custom-input-error/custom-input-error.component';

@Component({
  selector: 'app-billing-details-insurance',
  templateUrl: './billing-details-insurance.component.html',
  styleUrls: ['./billing-details-insurance.component.scss'],
})
export class BillingDetailsInsuranceComponent {
  @Input() insurance?: InsuranceForm;

  autocompleteControl = new FormControl();
  form = injectSignalForm().controls.insurances;

  insurancePlans: { id: number; displayName: string }[];
  isPolicyholderSectionExpanded = false;

  trackByIndex(index: number) {
    return index;
  }

  constructor() {
    this.insurancePlans = new Array(20).fill(20).map((_, index) => ({
      id: index,
      displayName: `Insurance plan ${index}`,
    }))
  }

  setAsPrimaryInsurance(indexToUpdate: number): void {
    this.form.controls.mutate(insurances => insurances[indexToUpdate].controls.isPrimary.value.set(true));
  }

  removeInsurance(index: number): void {
  }

  linkPageToInsurance(): void {}

  displayFn(insurance: { id: string, displayName: string }): string {
    return insurance && insurance.displayName ? insurance.displayName : '';
  }

  showPolicyholderSection(): void {
    this.isPolicyholderSectionExpanded = true;
  }

  hidePolicyHolderForm(): void {
    this.isPolicyholderSectionExpanded = false;
  }
}

