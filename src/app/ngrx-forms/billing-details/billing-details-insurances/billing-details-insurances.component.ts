import { Component, Input } from '@angular/core';
import { AddArrayControlAction, FormGroupState, MarkAsSubmittedAction, NgrxFormControlId, ResetAction, SetValueAction } from 'ngrx-forms';
import { InsuranceForm } from 'src/app/shared/models';
import { FormValue, INITIAL_STATE, State, createInitialInsurancePlan } from '../../store/reducers/billing-form.reducer';
import { Observable, map, take } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { AddInsurancesAction, ClearInsurancesAction } from '../../store/actions/billing-form.actions';

@Component({
  selector: 'app-billing-details-insurances',
  templateUrl: './billing-details-insurances.component.html',
  styleUrls: ['./billing-details-insurances.component.scss']
})
export class BillingDetailsInsurancesComponent {
  @Input() insurances?: InsuranceForm[];

  formState$: Observable<FormGroupState<FormValue>>;
  insurances$: Observable<InsuranceForm[]>;

  constructor(private store: Store<State>) {
    this.formState$ = store.pipe(select(s => s.billingForm.formState));
    this.insurances$ = store.pipe(select(s => s.billingForm.insurances));
  }

  addInsurance(index: number) {
    this.formState$.pipe(
      take(1),
      map(s => s.controls.insurances.id),
      map(id => new AddArrayControlAction(id, createInitialInsurancePlan(), index)),
    ).subscribe(this.store);
  }

  addInsurances(): void {
    this.insurances = [
      {
        id: "6d052ae8-a6dc-4b6b-b670-c746c4c625f8",
        insurancePlanId: 'df4ceed9-a0f0-49ba-8bfe-db4a573ed082',
        idNumber: "4354354",
        groupNumber: "543534",
        policyHolder: {
          label: "AUTO auto (Self)",
          firstName: "AUTO",
          lastName: "auto",
          middleInitial: 's',
          relation: "relationshipForInsurance.self",
          dateOfBirth: "1971-11-01",
          sex: 1,
          address: {
            addressLine1: "345 Rippin Hill",
            addressLine2: "Apt. 262",
            city: "Baileyton",
            country: "country.US",
            state: "state.CA",
            zipCode: "61469"
          },
          mobilePhone: "+12095290468",
          homePhone: null
        },
        cardFrontId: null,
        cardBackId: null,
        cardFrontDocumentId: null,
        cardBackDocumentId: null,
        examInsurance: {
          eligibility: {
            status: "eligibility.notChecked",
            statusUpdatedOn: "2023-10-31T11:16:28.478464Z",
            lastStatus: null,
            lastStatusUpdatedOn: null
          },
          authorization: {
            status: "authorization.notStarted",
            number: null,
            expirationDate: null
          },
          examPrice: null,
          patientOutOfPocket: null
        },
        isPrimary: true,
        isActive: true
      },
      {
        id: "6d052ae8-a6dc-4b6b-b670-c746c4c625f8",
        insurancePlanId: 'df4ceed9-a0f0-49ba-8bfe-db4a573ed082',
        idNumber: "4354354",
        groupNumber: "543534",
        policyHolder: {
          label: "AUTO auto (Self)",
          firstName: "AUTO",
          lastName: "auto",
          middleInitial: 's',
          relation: "relationshipForInsurance.self",
          dateOfBirth: "1971-11-01",
          sex: 1,
          address: {
            addressLine1: "345 Rippin Hill",
            addressLine2: "Apt. 262",
            city: "Baileyton",
            country: "country.US",
            state: "state.CA",
            zipCode: "61469"
          },
          mobilePhone: "+12095290468",
          homePhone: null
        },
        cardFrontId: null,
        cardBackId: null,
        cardFrontDocumentId: null,
        cardBackDocumentId: null,
        examInsurance: {
          eligibility: {
            status: "eligibility.notChecked",
            statusUpdatedOn: "2023-10-31T11:16:28.478464Z",
            lastStatus: null,
            lastStatusUpdatedOn: null
          },
          authorization: {
            status: "authorization.notStarted",
            number: null,
            expirationDate: null
          },
          examPrice: null,
          patientOutOfPocket: null
        },
        isPrimary: true,
        isActive: true
      }
    ];

    this.reset();
    this.store.dispatch(new AddInsurancesAction(this.insurances, true));
  }

  reset(): void {
    this.store.dispatch(new ResetAction(INITIAL_STATE.controls.insurances.id));
  }

  clear(): void {
    this.store.dispatch(new ClearInsurancesAction());
  }

  submit(): void {
    this.store.dispatch(new MarkAsSubmittedAction(INITIAL_STATE.controls.insurances.id));
  }
}
