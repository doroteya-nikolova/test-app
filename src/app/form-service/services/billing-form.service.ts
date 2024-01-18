import { Injectable } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { BehaviorSubject, Subject } from 'rxjs';
import { InsuranceForm, InsuranceViewModel } from 'src/app/shared/models';
import { FormDataService } from './form-data.service';
import { InsuranceBEModel, InsuranceEmitterType } from './billing-form.model';
import { MappingConfig } from '../form-helpers/types';
import { FormUtil } from '../form-helpers/form-util.helper';
import { BillingType } from '../billing-details/billing-details.component';

@Injectable()
export class BillingInsuranceDataService extends FormDataService<InsuranceBEModel, InsuranceViewModel> {
  protected get initialForm() {
    return { billingType: BillingType.Insurance, insurances: this.fb.array([]) };
  }

  protected get initialSubjects(): { [key: string]: Subject<any> } {
    return {
      insurances: new BehaviorSubject<any[]>([]),
      billingType: new BehaviorSubject<string>(''),
    };
  }

  get insurancesArray(): FormArray {
    return this.form?.get('insurances') as FormArray;
  }

  private formFactory: FormUtil;

  constructor(protected formBuilder: FormBuilder) {
    super(formBuilder);
    this.formFactory = new FormUtil(this.formBuilder);
    this.mapBackEndToFrontEnd();
  }

  getInsuranceSubject(name: InsuranceEmitterType) {
    return super.getSubject(name);
  }

  getInsuranceDataForSubmit(): InsuranceBEModel | null {
    return null;
    // return super.getDataForSubmit(fieldMapper, adapterBEFunctionsMapper);
  }

  addInsurance(insurance?: InsuranceForm): void {
    const newInsurance = this.formFactory.createGroup(this.initialInsuranceFormGroup(insurance));
    this.insurancesArray?.push(newInsurance);
  }

  resetInsurances(): void {
    this.isFormReady.next(false);

    if (this.insurancesArray) {
      this.insurancesArray.reset({}, { emitEvent: false });
    } else {
      this.addInsurance();
    }
  }

  prepopulateInsurance(insurances: InsuranceForm[]) {
    insurances.forEach(insurance => this.addInsurance(insurance));
  }

  resetFormState(): void {
    this.resetInsurances();
    this.getForm()?.reset(this.initialForm);
  }

  mapBackEndToFrontEnd() {
    const BE = {
      id: "9d8aadf0-f503-4244-857e-332e13f7dfe1",
      insurancePlan: {
        id: "64423703-b0e2-4a71-a3fb-0953d60e7ebd",
        planNumber: "90000",
        planType: null,
        name: "NULL",
        payor: "ADVENTIST HEALTH SYSTEM WES",
        financialClass: "financialClass.private",
        displayName: "ADVENTIST HEALTH SYSTEM WES",
        claimsAddress: {
          addressLine1: null,
          addressLine2: null,
          city: "ROSEVILLE",
          state: "state.CA",
          country: "country.US",
          zipCode: "95661",
          poBox: "619031"
        },
        claimsPhone: "+18004412524",
        fax: null,
        notes: null,
        payorId: "PAY0000000928",
        isActive: true
      },
      idNumber: "4324234",
      groupNumber: "432423",
      policyHolder: {
        label: "Patient",
        firstName: "john",
        lastName: "doe",
        middleInitial: null,
        relation: "relationshipForInsurance.self",
        dateOfBirth: "2021-01-01",
        sex: 1,
        address: {
          addressLine1: null,
          addressLine2: null,
          city: null,
          country: "country.US",
          state: null,
          zipCode: null
        },
        mobilePhone: null,
        homePhone: "+14242133333"
      },
      cardFrontId: null,
      cardBackId: null,
      cardFrontDocumentId: null,
      cardBackDocumentId: null,
      examInsurance: {
        eligibility: {
          status: "eligibility.eligible",
          statusUpdatedOn: "2023-11-01T14:37:08.114689Z",
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
      createdAt: "2023-11-01T08:25:01.47209Z"
    };

    const mappingConfig: Partial<MappingConfig<any>> = {
      'insurancePlan.id': 'insurancePlanId',
    };

    // Mapper
    const result = this.generateMappingConfig(BE, mappingConfig as any, ['insurancePlan']);
  }

  initialInsuranceFormGroup(insurance?: InsuranceForm) {
    return {
      id: insurance?.id ?? '',
      insurancePlanId: insurance?.insurancePlanId ?? '',
      idNumber: insurance?.idNumber ?? '',
      groupNumber: insurance?.groupNumber ?? '',
      policyHolder: {
        label: insurance?.policyHolder?.label ?? '',
        firstName: insurance?.policyHolder?.firstName ?? '',
        middleInitial: insurance?.policyHolder?.middleInitial ?? '',
        lastName: insurance?.policyHolder?.lastName ?? '',
        dateOfBirth: insurance?.policyHolder?.dateOfBirth ?? '',
        birth: insurance?.policyHolder?.birth ?? '',
        relation: insurance?.policyHolder?.relation ?? '',
        sex: insurance?.policyHolder?.sex ?? null,
        homePhone: insurance?.policyHolder?.homePhone ?? '',
        mobilePhone:  insurance?.policyHolder?.mobilePhone ?? '',
        address: {
          addressLine1: insurance?.policyHolder?.address?.addressLine1 ?? '',
          addressLine2: insurance?.policyHolder?.address?.addressLine2 ?? '',
          city: insurance?.policyHolder?.address?.city ?? '',
          country: insurance?.policyHolder?.address?.country ?? '',
          state: insurance?.policyHolder?.address?.state ?? '',
          zipCode: insurance?.policyHolder?.address?.zipCode ?? ''
        },
      },
      cardFrontId: insurance?.cardFrontId ?? '',
      cardBackId: insurance?.cardBackId ?? '',
      cardFrontDocumentId: insurance?.cardFrontDocumentId ?? '',
      cardBackDocumentId: insurance?.cardBackDocumentId ?? '',
      examInsurance: {
        eligibility: {
          status: insurance?.examInsurance?.eligibility?.status ?? '',
          statusUpdatedOn: insurance?.examInsurance?.eligibility?.statusUpdatedOn ?? '',
          lastStatus: insurance?.examInsurance?.eligibility?.lastStatus ?? null,
          lastStatusUpdatedOn: insurance?.examInsurance?.eligibility?.lastStatusUpdatedOn ?? null
        },
        authorization: {
          status: insurance?.examInsurance?.authorization?.status ?? '',
          number: insurance?.examInsurance?.authorization?.number ?? null,
          expirationDate: insurance?.examInsurance?.authorization?.expirationDate ?? null
        },
        examPrice: insurance?.examInsurance?.examPrice ?? null,
        patientOutOfPocket: insurance?.examInsurance?.patientOutOfPocket ?? null
      },
      isPrimary: insurance?.isPrimary ?? false,
      isActive: insurance?.isActive ?? true
     }
  }
}
