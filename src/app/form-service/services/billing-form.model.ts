export interface InsuranceBEModel {
  id: string;
  insurancePlan: {
    id: string;
    planNumber: string;
    planType: string | null;
    name: string | null;
    payor: string;
    financialClass: string;
    displayName: string;
    claimsAddress: {
      addressLine1: string | null;
      addressLine2: string | null;
      city: string;
      state: string;
      country: string;
      zipCode: string
      poBox: string;
    },
    claimsPhone: string;
    fax: string | null;
    notes: string | null;
    payorId: string;
    isActive: boolean;
  },
  idNumber: string;
  groupNumber: string;
  policyHolder: {
    label: string | null;
    firstName: string;
    lastName: string;
    middleInitial: string | null;
    relation: string;
    dateOfBirth: string;
    sex: number;
    address: {
      addressLine1: string | null;
      addressLine2: string | null;
      city: string | null;
      country: string | null;
      state: string | null;
      zipCode: string | null;
    } | null;
    mobilePhone: string | null;
    homePhone: string | null;
  },
  cardFrontId: string | null;
  cardBackId: string | null;
  cardFrontDocumentId: string | null;
  cardBackDocumentId: string | null;
  examInsurance: {
    eligibility: {
      status: string | null;
      statusUpdatedOn: string | null;
      lastStatus: string | null;
      lastStatusUpdatedOn: string | null;
    } | null,
    authorization: {
      status: string | null;
      number: string | null;
      expirationDate: string | null;
    } | null,
    examPrice: string | null;
    patientOutOfPocket: string | null;
  },
  isPrimary: boolean;
  createdAt: string;
};

export enum InsuranceEmitterType {
  id = 'id',
  insurancePlan = 'insurancePlan',
  idNumber = 'idNumber',
  groupNumber = 'groupNumber',
  policyHolder = 'policyHolder',
  cardFrontId = 'cardFrontId',
  cardBackId = 'cardBackId',
  cardFrontDocumentId = 'cardFrontDocumentId',
  cardBackDocumentId = 'cardBackDocumentId',
  examInsurance = 'examInsurance',
  isPrimary = 'isPrimary',
  isActive = 'isActive',
  insurances = 'insurances'
}