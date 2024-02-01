import { InsuranceForm } from "./models";

export enum BillingType {
  SelfPay = 'billingType.selfPay',
  Insurance = 'billingType.insurance',
  WorkerCompensation = 'billingType.workersComp',
  PersonalInjury = 'billingType.personalInjury',
  External = 'billingType.external',
  NonBillable = 'billingType.nonBillable',
}

export const initialInsurancePlan: InsuranceForm = {
  id: '',
  insurancePlanId: '',
  idNumber: '',
  groupNumber: '',
  policyHolder: {
   label: '',
   firstName: '',
   middleInitial: '',
   lastName: '',
   dateOfBirth: '',
   birth: '',
   relation: '',
   sex: 0,
   homePhone: '',
   mobilePhone: '',
   address: {
     addressLine1: '',
     addressLine2: '',
     city: '',
     state: '',
     country: '',
     poBox: '',
     zipCode: ''
   }
  },
  cardFrontId: '',
  cardBackId: '',
  cardFrontDocumentId: '',
  cardBackDocumentId: '',
  examInsurance: {
   eligibility: {
     status: '',
     statusUpdatedOn: '',
     lastStatus: '',
     lastStatusUpdatedOn: ''
   },
   authorization: {
     status: '',
     number: '',
     expirationDate: '',
   },
   examPrice: 0,
   patientOutOfPocket: 0,
   isLoading: false,
   hasError: false,
   errorMessage: ''
  },
  isPrimary: false,
  isActive: true
}