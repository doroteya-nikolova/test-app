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
        id: "1",
        insurancePlanId: 'XYZ123',
        idNumber: "ID123456",
        groupNumber: "GRP789",
        policyHolder: {
          label: "Mr.",
          firstName: "John",
          middleInitial: 'M',
          lastName: "Doe",
          relation: "Self",
          dateOfBirth: "1990-05-15",
          sex: 1,
          address: {
            addressLine1: "123 Main St",
            addressLine2: "Apt 4B",
            city: "Anytown",
            state: "CA",
            country: "USA",
            poBox: "PO Box 789",
            zipCode: "12345"
          },
          mobilePhone: "555-1234",
          homePhone: "555-5678"
        },
        cardFrontId: "front123",
        cardBackId: "back456",
        cardFrontDocumentId: "doc123",
        cardBackDocumentId: "doc456",
        examInsurance: {
          eligibility: {
            status: "Verified",
            statusUpdatedOn: "2024-01-22",
            lastStatus: "Pending",
            lastStatusUpdatedOn: "2024-01-20"
          },
          authorization: {
            status: "Approved",
            number: "AUTH789",
            expirationDate: "2025-01-01"
          },
          examPrice: 150,
          patientOutOfPocket: 50,
          isLoading: false,
          hasError: false,
          errorMessage: ""
        },
        isPrimary: true,
        isActive: true
      },
      {
        id: "2",
        insurancePlanId: 'ABC456',
        idNumber: "ID789012",
        groupNumber: "GRP123",
        policyHolder: {
          label: "Mrs.",
          firstName: "Alice",
          middleInitial: 'L',
          lastName: "Smith",
          relation: "Spouse",
          dateOfBirth: "1985-08-22",
          sex: 2,
          address: {
            addressLine1: "456 Oak St",
            addressLine2: "Unit 7C",
            city: "Othercity",
            state: "NY",
            country: "USA",
            poBox: "PO Box 567",
            zipCode: "67890"
          },
          mobilePhone: "555-9876",
          homePhone: "555-5432"
        },
        cardFrontId: "front789",
        cardBackId: "back012",
        cardFrontDocumentId: "doc789",
        cardBackDocumentId: "doc012",
        examInsurance: {
          eligibility: {
            status: "Verified",
            statusUpdatedOn: "2024-01-22",
            lastStatus: "Verified",
            lastStatusUpdatedOn: "2024-01-21"
          },
          authorization: {
            status: "Approved",
            number: "AUTH456",
            expirationDate: "2024-12-31"
          },
          examPrice: 200,
          patientOutOfPocket: 75,
          isLoading: false,
          hasError: false,
          errorMessage: ""
        },
        isPrimary: false,
        isActive: true
      },
      {
        id: "3",
        insurancePlanId: 'PQR789',
        idNumber: "ID345678",
        groupNumber: "GRP456",
        policyHolder: {
          label: "Mr.",
          firstName: "David",
          middleInitial: 'S',
          lastName: "Johnson",
          relation: "Child",
          dateOfBirth: "1978-03-10",
          sex: 1,
          address: {
            addressLine1: "789 Pine St",
            addressLine2: "Apt 12D",
            city: "Someville",
            state: "TX",
            country: "USA",
            poBox: "PO Box 123",
            zipCode: "34567"
          },
          mobilePhone: "555-3456",
          homePhone: "555-7890"
        },
        cardFrontId: "front345",
        cardBackId: "back678",
        cardFrontDocumentId: "doc345",
        cardBackDocumentId: "doc678",
        examInsurance: {
          eligibility: {
            status: "Pending",
            statusUpdatedOn: "2024-01-22",
            lastStatus: "Pending",
            lastStatusUpdatedOn: "2024-01-20"
          },
          authorization: {
            status: "Not Applicable",
            number: "",
            expirationDate: ""
          },
          examPrice: 100,
          patientOutOfPocket: 30,
          isLoading: false,
          hasError: false,
          errorMessage: ""
        },
        isPrimary: false,
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
