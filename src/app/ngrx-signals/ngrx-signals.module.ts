import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillingDetailsInsuranceComponent } from './billing-details/billing-details-insurance/billing-details-insurance.component';
import { BillingDetailsInsurancesComponent } from './billing-details/billing-details-insurances/billing-details-insurances.component';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './store/ngrx-signals.reducer';

const declarations = [
  BillingDetailsComponent,
  BillingDetailsInsuranceComponent,
  BillingDetailsInsurancesComponent
]

@NgModule({
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        StoreModule.forFeature('signalsBillingForm', reducers),
        RouterModule.forChild([
          {
            path: '',
            component: BillingDetailsComponent,
          },
        ]),
        ...declarations,
    ],
})
export class NgrxSignalsModule { }
