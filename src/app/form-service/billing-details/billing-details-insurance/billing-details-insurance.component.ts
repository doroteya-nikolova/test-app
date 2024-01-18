import { Component, Input } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { InsuranceForm } from 'src/app/shared/models';
import { BillingInsuranceDataService } from '../../services/billing-form.service';

@Component({
  selector: 'app-billing-details-insurance',
  templateUrl: './billing-details-insurance.component.html',
  styleUrls: ['./billing-details-insurance.component.scss']
})
export class BillingDetailsInsuranceComponent {
  @Input() insurance?: InsuranceForm;
  insuranceForm: FormArray | undefined;

  autocompleteControl = new FormControl();

  insurancePlans: { id: number; displayName: string }[];
  isPolicyholderSectionExpanded = false;

  trackByIndex(index: number) {
    return index;
  }

  constructor(public formData: BillingInsuranceDataService) {
    this.insurancePlans = new Array(20).fill(20).map((_, index) => ({
      id: index,
      displayName: `Insurance plan ${index}`,
    }))
  }

  ngOnInit(): void {
    this.insuranceForm = this.formData.insurancesArray;
  }

  setAsPrimaryInsurance(index: number): void {
    const value = this.insuranceForm?.controls[index]?.value as InsuranceForm;
    this.insuranceForm?.controls[index].patchValue({ ...value, isPrimary: true });
  }

  removeInsurance(index: number): void {
    if (this.insuranceForm && this.insuranceForm.length > 1) {
      this.insuranceForm.removeAt(index);
    } else {
      this.insuranceForm?.reset({ emitEvent: false });
    }
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

