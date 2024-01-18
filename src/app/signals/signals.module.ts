import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { BillingDetailsInsuranceComponent } from './billing-details/billing-details-insurance/billing-details-insurance.component';
import { BillingDetailsInsurancesComponent } from './billing-details/billing-details-insurances/billing-details-insurances.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignalInputDebounceDirective, SignalInputDirective, SignalInputErrorDirective, withErrorComponent } from './signals-form';
import { provideSignalForm } from './billing-details/billing-form.form';
import { CustomErrorComponent } from '../shared/components/custom-input-error/custom-input-error.component';

const  COMPONENTS = [
  BillingDetailsComponent, 
  BillingDetailsInsuranceComponent,
  BillingDetailsInsurancesComponent,
];


@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    SignalInputDebounceDirective,
    SignalInputDirective,
    SignalInputErrorDirective,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', component: BillingDetailsComponent },
    ]),
  ],
  declarations: [
    COMPONENTS
  ],
  providers: [provideSignalForm(), withErrorComponent(CustomErrorComponent)]
})
export class SignalsModule { }
