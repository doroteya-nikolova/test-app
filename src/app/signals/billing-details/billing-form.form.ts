
import { WritableSignal, signal } from '@angular/core';
import { FormField, V, createFormField, createFormGroup, createInjectableSignalForm, FormGroup } from '../signals-form';
import { BillingType } from 'src/app/shared/constants';
import { InsuranceForm } from 'src/app/shared/models';


// Creates a simple container for managing the passed state using Signals. 
export const { injectSignalForm, provideSignalForm } =
  createInjectableSignalForm(() =>
    createFormGroup(() => ({
      billingType: createFormField(BillingType.Insurance, {
        validators: [V.required()]
      }),

      insurances: createFormGroup<WritableSignal<FormGroup<Insurance>[]>>(
        () => {
          return signal([createInsurance()]);
        },
        {
          validators: [V.minLength(1)],
        }
      ),
    }))
  );

export const createInsurance = (insurance?: InsuranceForm): FormGroup<Insurance> => {
  return createFormGroup<Insurance>(() => ({
    id: createFormField(insurance?.id ?? ''),
    insurancePlanId: createFormField(insurance?.insurancePlanId ?? '', { validators: [V.required()]}),
    idNumber: createFormField<string>(insurance?.idNumber ?? '', { validators: [V.required()]}),
    groupNumber: createFormField(insurance?.groupNumber ?? ''),
    policyHolder: createFormGroup(() => ({
        label: createFormField(insurance?.policyHolder?.label ?? 'Patient', { validators: [V.required()]}),
        firstName: createFormField<string | null>(insurance?.policyHolder?.firstName ?? '', { validators: [V.required()]}),
        middleInitial: createFormField<string | null>(insurance?.policyHolder?.middleInitial ?? null, { validators: [V.required()]}),
        lastName: createFormField<string>(insurance?.policyHolder?.lastName ?? '', { validators: [V.required()]}),
        dateOfBirth: createFormField<string | null>(insurance?.policyHolder?.dateOfBirth ?? '', { validators: [V.required()]}),
        birth: createFormField<string>(insurance?.policyHolder?.birth ?? '', { validators: [V.required()]}),
        relation: createFormField<string>(insurance?.policyHolder?.relation ?? '', { validators: [V.required()]}),
        sex: createFormField<number | null>(insurance?.policyHolder?.sex ?? null),
        homePhone: createFormField<string | null>(insurance?.policyHolder?.homePhone ?? ''),
        mobilePhone: createFormField<string | null>(insurance?.policyHolder?.mobilePhone ?? ''),
        address: createFormGroup(() => ({
            addressLine1: createFormField<string | null>(insurance?.policyHolder?.address?.addressLine1 ?? ''),
            addressLine2: createFormField<string | null>(insurance?.policyHolder?.address?.addressLine2 ?? ''),
            city: createFormField<string | null>(insurance?.policyHolder?.address?.city ?? ''),
            state: createFormField<string | null>(insurance?.policyHolder?.address?.state ?? ''),
            country: createFormField<string | null>(insurance?.policyHolder?.address?.country ?? ''),
            poBox: createFormField<string | null>(insurance?.policyHolder?.address?.poBox ?? ''),
            zipCode: createFormField<string | null>(insurance?.policyHolder?.address?.zipCode ?? '')
          })
        )
      })
    ),
    cardFrontId: createFormField<string | null>(insurance?.cardFrontId ?? ''),
    cardBackId: createFormField<string | null>(insurance?.cardBackId ?? ''),
    cardFrontDocumentId: createFormField<string | null>(insurance?.cardFrontDocumentId ?? ''),
    cardBackDocumentId: createFormField<string | null>(insurance?.cardBackDocumentId ?? ''),
    isPrimary: createFormField<boolean>(insurance?.isPrimary ?? false),
    isActive: createFormField<boolean>(insurance?.isActive ?? true),
    examInsurance: createFormGroup(() => ({
        eligibility: createFormGroup(() => ({
            status: createFormField<string | null>(insurance?.examInsurance?.eligibility?.status ?? ''),
            statusUpdatedOn: createFormField<string | null>(insurance?.examInsurance?.eligibility?.statusUpdatedOn ?? ''),
            lastStatus: createFormField<string | null>(insurance?.examInsurance?.eligibility?.lastStatus ?? ''),
            lastStatusUpdatedOn: createFormField<string | null>(insurance?.examInsurance?.eligibility?.lastStatusUpdatedOn ?? '')
          })
        ),
        authorization: createFormGroup(() => ({
            status: createFormField<string | null>(insurance?.examInsurance?.authorization?.status ?? ''),
            number: createFormField<string | null>(insurance?.examInsurance?.authorization?.number ?? ''),
            expirationDate: createFormField<string | null>(insurance?.examInsurance?.authorization?.expirationDate ?? ''),
          })
        ),
        examPrice: createFormField<number | null>(insurance?.examInsurance?.examPrice ?? 0),
        patientOutOfPocket: createFormField<number | null>(insurance?.examInsurance?.patientOutOfPocket ?? 0),
        isLoading: createFormField<boolean>(insurance?.examInsurance?.isLoading ?? false),
        hasError: createFormField<boolean>(insurance?.examInsurance?.hasError ?? false),
        errorMessage: createFormField<string | null>(insurance?.examInsurance?.errorMessage ?? null),
      })),
  }));
};

export type Insurance = {
  id: FormField<string>;
  insurancePlanId: FormField<string>;
  idNumber: FormField<string>;
  groupNumber: FormField<string>;
  policyHolder: FormGroup<any>;
  cardFrontId: FormField<string | null>;
  cardBackId: FormField<string | null>;
  cardFrontDocumentId: FormField<string | null>;
  cardBackDocumentId: FormField<string | null>;
  isPrimary: FormField<boolean>;
  isActive: FormField<boolean>;
  examInsurance: FormGroup<any>;
};
  
