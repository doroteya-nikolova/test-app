import {
  patchState,
  signalStoreFeature,
  type,
  withMethods,
  withState,
} from '@ngrx/signals';
import { inject, ProviderToken } from '@angular/core';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { debounceTime, Observable, of, pipe } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { tapResponse } from '@ngrx/operators';
import { withLoading } from './with-loading';
import { BillingType, generateRandomId } from 'src/app/shared';
import { InsuranceForm, InsuranceWithPlan } from 'src/app/shared/models';
import { withEntities } from '@ngrx/signals/entities';
import { getEntityIds, mapEntities } from 'src/app/shared/ngrx-utils/map-entities';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

export const initialInsuranceFormGroup = (insurance?: InsuranceForm) => {
  return new FormGroup({
    id: new FormControl(insurance?.id ?? generateRandomId(), { nonNullable: true}),
    insurancePlanId: new FormControl(insurance?.insurancePlanId ?? '', { nonNullable: true}),
    idNumber: new FormControl(insurance?.idNumber ?? '', { nonNullable: true}),
    groupNumber: new FormControl(insurance?.groupNumber ?? '', { nonNullable: true}),
    policyHolder: new FormGroup({
      label: new FormControl(insurance?.policyHolder?.label ?? '', { nonNullable: true}),
      firstName: new FormControl(insurance?.policyHolder?.firstName ?? '', { nonNullable: true}),
      middleInitial: new FormControl(insurance?.policyHolder?.middleInitial ?? '', { nonNullable: true}),
      lastName: new FormControl(insurance?.policyHolder?.lastName ?? '', { nonNullable: true}),
      dateOfBirth: new FormControl(insurance?.policyHolder?.dateOfBirth ?? '', { nonNullable: true}),
      birth: new FormControl(insurance?.policyHolder?.birth ?? '', { nonNullable: true}),
      relation: new FormControl(insurance?.policyHolder?.relation ?? '', { nonNullable: true}),
      sex: new FormControl(insurance?.policyHolder?.sex ?? null),
      homePhone: new FormControl(insurance?.policyHolder?.homePhone ?? '', { nonNullable: true}),
      mobilePhone:  new FormControl(insurance?.policyHolder?.mobilePhone ?? '', { nonNullable: true}),
      address: new FormGroup({
        addressLine1: new FormControl(insurance?.policyHolder?.address?.addressLine1 ?? '', { nonNullable: true}),
        addressLine2: new FormControl(insurance?.policyHolder?.address?.addressLine2 ?? '', { nonNullable: true}),
        city: new FormControl(insurance?.policyHolder?.address?.city ?? '', { nonNullable: true}),
        country: new FormControl(insurance?.policyHolder?.address?.country ?? '', { nonNullable: true}),
        state: new FormControl(insurance?.policyHolder?.address?.state ?? '', { nonNullable: true}),
        zipCode: new FormControl(insurance?.policyHolder?.address?.zipCode ?? '', { nonNullable: true})
      }),
    }),
    cardFrontId: new FormControl(insurance?.cardFrontId ?? '', { nonNullable: true}),
    cardBackId: new FormControl(insurance?.cardBackId ?? '', { nonNullable: true}),
    cardFrontDocumentId: new FormControl(insurance?.cardFrontDocumentId ?? '', { nonNullable: true}),
    cardBackDocumentId: new FormControl(insurance?.cardBackDocumentId ?? '', { nonNullable: true}),
    examInsurance: new FormGroup({
      eligibility: new FormGroup({
        status: new FormControl(insurance?.examInsurance?.eligibility?.status ?? '', { nonNullable: true}),
        statusUpdatedOn: new FormControl(insurance?.examInsurance?.eligibility?.statusUpdatedOn ?? '', { nonNullable: true}),
        lastStatus: new FormControl(insurance?.examInsurance?.eligibility?.lastStatus ?? null),
        lastStatusUpdatedOn: new FormControl(insurance?.examInsurance?.eligibility?.lastStatusUpdatedOn ?? null)
      }),
      authorization: new FormGroup({
        status: new FormControl(insurance?.examInsurance?.authorization?.status ?? '', { nonNullable: true}),
        number: new FormControl(insurance?.examInsurance?.authorization?.number ?? null),
        expirationDate: new FormControl(insurance?.examInsurance?.authorization?.expirationDate ?? null)
      }),
      examPrice: new FormControl(insurance?.examInsurance?.examPrice ?? null),
      patientOutOfPocket: new FormControl(insurance?.examInsurance?.patientOutOfPocket ?? null)
    }),
    isPrimary: new FormControl(insurance?.isPrimary ?? false, { nonNullable: true}),
    isActive: new FormControl(insurance?.isActive ?? true, { nonNullable: true})
   })
}

export const billingForm = () => {
  const initInsurance = initialInsuranceFormGroup();
  return new FormGroup ({
    billingType: new FormControl<BillingType>(BillingType.Insurance),
    insurances: new FormArray([initInsurance]),
    workCompensations: new FormArray([]),
    personalInjuries: new FormArray([])
  });
}

export interface ResponseEntity<Entity> {
  billingType: BillingType;
  insurances: Entity[];
  workCompensations: Entity[];
  personalInjuries: Entity[];
}

export function withBillingEntities<Entity extends { id: string }>(
Loader: ProviderToken<{
    loadBillingDetails: () => Observable<ResponseEntity<Entity>>;
    changeBillingType: (billingType: BillingType) => Observable<ResponseEntity<Entity>>;
    deleteInsurance: (insuranceId?: string) => Observable<ResponseEntity<Entity>>;
    updateInsurance: (insuranceId?: string, data?: InsuranceForm) => Observable<ResponseEntity<Entity>>;
    createInsurance: (data: InsuranceForm) => Observable<ResponseEntity<Entity>>;
    createInsurances: (data: InsuranceForm[]) => Observable<ResponseEntity<Entity>>;
  }>,
) {
  return signalStoreFeature(
    withLoading(),
    withState({
      billingType: BillingType.Insurance,
      formState: billingForm()
    }),
    withEntities({ entity: type<InsuranceForm>(), collection: 'insurances' }),
    withEntities({ entity: type<any>(), collection: 'workCompensations' }),
    withEntities({ entity: type<any>(), collection: 'personalInjuries' }),
    withMethods((state) => {
      const service = inject(Loader);

      const handleBillingResponse = (response: ResponseEntity<Entity>) => {
        patchState(state, {
          billingType: response.billingType,
          insurancesEntityMap: mapEntities(response.insurances),
          insurancesIds: getEntityIds(response.insurances),
          personalInjuriesEntityMap: mapEntities(response.personalInjuries),
          personalInjuriesIds: getEntityIds(response.personalInjuries),
          workCompensationsEntityMap: mapEntities(response.workCompensations),
          workCompensationsIds: getEntityIds(response.workCompensations),
        });
        updateFormControls();
      };

      const updateFormControls = (insurances?: InsuranceForm[]) => {
        const formState = state.formState();
        const billingType = state.billingType()
        const insurancesEntities = insurances ?? state.insurancesEntities();
        
        // Set billing type control value
        formState.controls.billingType.setValue(billingType);
      
        const insurancesArray = formState.controls.insurances;
      
        // Clear existing insurances and add new ones
        insurancesArray.clear();
        insurancesArray.reset([], { emitEvent: false });

        insurancesEntities.forEach((insurance) => {
          const insuranceFormGroup = initialInsuranceFormGroup(insurance);
          insurancesArray.push(insuranceFormGroup);
        });     
      };
          
      return {
        load: rxMethod<void>(
          pipe(
            tap(() => state.setLoading(true)),
            debounceTime(1000),
            switchMap(() => service.loadBillingDetails()),
            tap(() => state.setLoading(false)),
            tapResponse({
              next: handleBillingResponse,
              error: console.error,
            }),
          ),
        ),
        changeBillingType: rxMethod<BillingType>(
          pipe(
            tap((billingType) => {
              const currentBillingType = state.billingType();
  
              if (currentBillingType === billingType) {
                return;
              }
              
              state.formState().controls.billingType.setValue(billingType);
              return patchState(state, { billingType })
            }),
            tap(() => state.setLoading(true)),
            debounceTime(1000),
            switchMap((billingType) => service.changeBillingType(billingType)),
            tap(() => state.setLoading(false)),
            tapResponse({
              next: handleBillingResponse,
              error: console.error,
            }),
          )
        ),
        removeInsurance: rxMethod<string | undefined>(
          pipe(
            tap(() => state.setLoading(true)),
            debounceTime(1000),
            switchMap((insuranceId) => {
              return service.deleteInsurance(insuranceId).pipe(
                catchError((error: HttpErrorResponse) => {
                  if (error.status === 404) {
                    /** Remove the insuranceId from the formState if it was emitted */
                    if (insuranceId) {
                      const indexToRemove = state.formState().controls.insurances.value.findIndex(item => item.id === insuranceId);
                      if (indexToRemove !== -1) {
                        state.formState().controls.insurances.removeAt(indexToRemove);
                      }
                    }

                    return service.loadBillingDetails();
                  }
                  throw error;
                })
              )
            }),
            tap(() => state.setLoading(false)),
            tapResponse({
              next: handleBillingResponse,
              error: console.error,
            }),
          )
        ),
        updateInsurance: rxMethod<{ insuranceId?: string, data?: InsuranceForm }>(
          pipe(
            tap(() => state.setLoading(true)),
            debounceTime(1000),
            switchMap((data) => service.updateInsurance(data.insuranceId, data.data)),
            tap(() => state.setLoading(false)),
            tapResponse({
              next: handleBillingResponse,
              error: console.error,
            }),
          )
        ),
        createInsurance: rxMethod<InsuranceForm>(
          pipe(
            tap(() => state.setLoading(true)),
            debounceTime(1000),
            switchMap((data) => service.createInsurance(data)),
            tap(() => state.setLoading(false)),
            tapResponse({
              next: handleBillingResponse,
              error: console.error,
            }),
          )
        ),
        createInsurances: rxMethod<InsuranceForm[]>(
          pipe(
            tap(() => state.setLoading(true)),
            debounceTime(1000),
            switchMap((data) => service.createInsurances(data)),
            tap(() => state.setLoading(false)),
            tapResponse({
              next: handleBillingResponse,
              error: console.error,
            }),
          )
        ),
        getBillingTypeControl() {
          return state.formState().controls.billingType;
        },
        addInsurances(insurances: InsuranceForm[]) {
          updateFormControls(insurances);  
        },
        getInsuranceFormArray() {
          return state.formState().controls.insurances;
        },
        getInsuranceFormGroupById(id: string | null) {
          const foundFormGroup = state.formState().controls.insurances.controls.find(
            (control: FormGroup) => control instanceof FormGroup && control.value.id === id
          );
        
          return foundFormGroup || null;
        },
        createInsuranceFormGroup() {
          const insuranceFormGroup = initialInsuranceFormGroup();
          state.formState().controls.insurances.push(insuranceFormGroup);
        }
      }
    }),
  );
}
