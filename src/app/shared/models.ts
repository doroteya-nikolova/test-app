import { BillingType } from "./constants";

export interface InsuranceWithPlan {
  id?: string;
  insurancePlan: InsurancePlan;
  idNumber?: string;
  groupNumber?: string;
  policyHolder?: PolicyHolder;
  cardFrontId?: string;
  cardBackId?: string;
  cardFrontDocumentId?: string;
  cardBackDocumentId?: string;
  examInsurance?: ExamInsurance;
  isPrimary?: boolean;
  createdAt?: Date;
}

export interface InsurancePlan {
  id: string;
  planNumber: string;
  planType: string;
  name?: string;
  payor: string;
  payorId?: string;
  financialClass: string;
  displayName: string;
  claimsPhone?: string;
  fax?: string;
  claimsAddress: Address;
  isActive?: boolean;
  notes?: string;
}

export interface Address {
  addressLine1?: string;
  addressLine2?: string;
  city: string;
  state: string;
  country?: string;
  poBox?: string;
  zipCode: string;
}

export interface InsuranceViewModel {
  billingType: BillingType;
  insurances: InsuranceForm[];
}

export interface InsuranceForm {
  id: string;
  insurancePlanId: string;
  idNumber: string;
  groupNumber: string;
  policyHolder: PolicyHolder | null;
  cardFrontId: string | null;
  cardBackId: string | null;
  cardFrontDocumentId: string | null;
  cardBackDocumentId: string | null;
  isPrimary: boolean;
  isActive: boolean;
  examInsurance: ExamInsurance | null;
}

export interface PolicyHolder {
  label?: string;
  firstName: string;
  middleInitial?: string;
  lastName: string;
  dateOfBirth: string;
  birth?: string;
  relation?: string;
  sex?: number;
  homePhone: string | null;
  mobilePhone: string | null;
  address?: Address;
}

export interface ExamInsurance {
  eligibility: Eligibility | null;
  authorization: Authorization | null;
  examPrice: number | null;
  patientOutOfPocket: number | null;
  isLoading?: boolean;
  hasError?: boolean;
  errorMessage?: string;
}

export interface Eligibility {
  status: string;
  statusUpdatedOn: string | null;
  lastStatus: string | null;
  lastStatusUpdatedOn: string |  null;
}

export interface Authorization {
  status: string | null;
  number: string | null;
  expirationDate: string | null;
}


