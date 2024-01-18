import { Component } from '@angular/core';
import { createInsurance, injectSignalForm } from '../billing-form.form';

@Component({
  selector: 'app-billing-details-insurances',
  templateUrl: './billing-details-insurances.component.html',
  styleUrls: ['./billing-details-insurances.component.scss']
})
export class BillingDetailsInsurancesComponent {
  insurances = injectSignalForm().controls.insurances.value();
  insuranceForm = injectSignalForm().controls.insurances;

  addInsurance() {
    this.insuranceForm.addNewArrayItem();
  }

  addInsurances(): void {
    const insurances = [
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
    this.insuranceForm.addNewArrayItem();
  }

  reset(): void {
    this.insuranceForm.reset();
    this.insuranceForm.controls.update(insurances => [...insurances, createInsurance()])
  }

  clear(): void {
  }

  submit(): void {
  }
}
