import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingDetailsInsurancesComponent } from './billing-details-insurances.component';

describe('BillingDetailsInsurancesComponent', () => {
  let component: BillingDetailsInsurancesComponent;
  let fixture: ComponentFixture<BillingDetailsInsurancesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillingDetailsInsurancesComponent]
    });
    fixture = TestBed.createComponent(BillingDetailsInsurancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
