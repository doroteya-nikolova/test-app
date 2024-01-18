import { Component } from '@angular/core';
import { InsuranceForm } from 'src/app/shared/models';
import { BillingInsuranceDataService } from '../../services/billing-form.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-billing-details-insurances',
  templateUrl: './billing-details-insurances.component.html',
  styleUrls: ['./billing-details-insurances.component.scss']
})
export class BillingDetailsInsurancesComponent {
  insurances?: InsuranceForm[];
  form: FormGroup | undefined;

  constructor(public formData: BillingInsuranceDataService) { }

  ngOnInit() {
    this.form = this.formData.getForm();
    this.insurances = this.formData.insurancesArray?.value;
  }

  addInsurance(): void {
    this.formData.addInsurance();
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
    this.clear();
    this.formData.prepopulateInsurance(this.insurances);
  }

  reset(): void {
    this.formData.insurancesArray.reset({ emitEvent: false });
  }

  clear(): void {
    while (this.formData.insurancesArray.length > 1) {
      this.formData.insurancesArray.removeAt(0);
    }

    this.formData.insurancesArray.reset({ emitEvent: false });
  }

  submit() {
  }
}
