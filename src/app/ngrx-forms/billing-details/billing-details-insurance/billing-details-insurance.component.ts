import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InsuranceForm } from 'src/app/shared/models';
import { FormValue, State } from '../../store/reducers/billing-form.reducer';
import { FormGroupState, RemoveArrayControlAction, SetValueAction, setValue } from 'ngrx-forms';
import { Observable, map, take } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { SetInsuranceAsPrimaryAction } from '../../store/actions/billing-form.actions';

@Component({
  selector: 'app-billing-details-insurance',
  templateUrl: './billing-details-insurance.component.html',
  styleUrls: ['./billing-details-insurance.component.scss']
})
export class BillingDetailsInsuranceComponent {
  @Input() insurance?: InsuranceForm;

  formState$: Observable<FormGroupState<FormValue>>;
  insurances$: Observable<InsuranceForm[]>;

  autocompleteControl = new FormControl();

  insurancePlans: { id: number; displayName: string }[];
  isPolicyholderSectionExpanded = false;

  trackByIndex(index: number) {
    return index;
  }

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.billingForm.formState));
    this.insurances$ = store.pipe(select(s => s.billingForm.insurances));

    this.insurancePlans = new Array(20).fill(20).map((_, index) => ({
      id: index,
      displayName: `Insurance plan ${index}`,
    }))
  }

  setAsPrimaryInsurance(index: number, value: boolean): void {
    this.store.dispatch(new SetInsuranceAsPrimaryAction(index, !value));
  }

  removeInsurance(index: number): void {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.insurances.id),
      map(id => new RemoveArrayControlAction(id, index)),
    ).subscribe(this.store);
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

