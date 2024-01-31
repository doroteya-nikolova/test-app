import { Component, Input, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InsuranceForm } from 'src/app/shared/models';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SharedModule } from '../../../shared/shared.module';
import { NgFor, NgIf } from '@angular/common';
import { NgRxSignalsStore } from '../../store/ngrx-signals.store';

@Component({
    selector: 'app-billing-details-insurance',
    templateUrl: './billing-details-insurance.component.html',
    styleUrls: ['./billing-details-insurance.component.scss'],
    standalone: true,
    imports: [NgFor, NgIf, SharedModule, MatButtonModule, MatIconModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule, MatOptionModule]
})
export class BillingDetailsInsuranceComponent {
  #store = inject(NgRxSignalsStore);

  @Input() insurance?: InsuranceForm;
  @Input() formId: string | null = null;

  autocompleteControl = new FormControl();

  insurancePlans: { id: number; displayName: string }[];
  isPolicyholderSectionExpanded = false;

  get insuranceForm() {
    return this.#store.getInsuranceFormGroupById(this.formId);
  }

  constructor() {
    this.insurancePlans = new Array(20).fill(20).map((_, index) => ({
      id: index,
      displayName: `Insurance plan ${index}`,
    }))
  }

  setAsPrimaryInsurance(): void {
    this.insuranceForm?.controls.isPrimary.setValue(true);
  }

  removeInsurance(): void {
    this.#store.removeInsurance(this.insurance?.id);
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

