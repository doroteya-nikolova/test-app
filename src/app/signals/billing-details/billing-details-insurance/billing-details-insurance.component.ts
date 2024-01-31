import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InsuranceForm } from 'src/app/shared/models';
import { injectSignalForm } from '../billing-form.form';

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
    this.form.controls.update(insurances => {
      return insurances.map((data, index) => {
        if(index === indexToUpdate) {
          data.controls.isPrimary.value.set(true)
        }

        return data;
      })
    });
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

