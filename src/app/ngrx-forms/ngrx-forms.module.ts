import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NgrxFormsModule } from 'ngrx-forms';
import { SharedModule } from '../shared/shared.module';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { StoreModule } from '@ngrx/store';
import { reducer } from './store/reducers/billing-form.reducer';
import { BillingDetailsInsuranceComponent } from './billing-details/billing-details-insurance/billing-details-insurance.component';
import { BillingDetailsInsurancesComponent } from './billing-details/billing-details-insurances/billing-details-insurances.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const declarations = [
  BillingDetailsComponent,
  BillingDetailsInsuranceComponent,
  BillingDetailsInsurancesComponent
]

@NgModule({
  imports: [
    CommonModule,
    NgrxFormsModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    StoreModule.forFeature('billingForm', reducer),
    RouterModule.forChild([
      { path: '', component: BillingDetailsComponent },
    ]), 
  ],
  declarations: [
    declarations
  ],
})
export class NgrxFormModule { }
