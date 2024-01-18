import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingDetailsInsuranceComponent } from './billing-details-insurance.component';

describe('BillingDetailsInsuranceComponent', () => {
  let component: BillingDetailsInsuranceComponent;
  let fixture: ComponentFixture<BillingDetailsInsuranceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BillingDetailsInsuranceComponent]
    });
    fixture = TestBed.createComponent(BillingDetailsInsuranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
