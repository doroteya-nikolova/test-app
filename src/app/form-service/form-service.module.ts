import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BillingDetailsComponent } from './billing-details/billing-details.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { BillingDetailsInsuranceComponent } from './billing-details/billing-details-insurance/billing-details-insurance.component';
import { BillingDetailsInsurancesComponent } from './billing-details/billing-details-insurances/billing-details-insurances.component';


const declarations = [BillingDetailsComponent, BillingDetailsInsuranceComponent, BillingDetailsInsurancesComponent]

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: BillingDetailsComponent },
    ]),
  ],
  declarations: [...declarations],
})
export class FormServiceModule {}
