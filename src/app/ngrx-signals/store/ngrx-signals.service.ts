import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';
import { InsuranceForm, LoadBillingResponse } from 'src/app/shared/models';
import { BillingType } from 'src/app/shared';

@Injectable({ providedIn: 'root' })
export class NgRxSignalsService {
  readonly baseUrl = 'http://localhost:4201';

  private http = inject(HttpClient);

  loadBillingDetails(): Observable<LoadBillingResponse> {
    return this.http
      .get<LoadBillingResponse>(`${this.baseUrl}/details`);
  }

  loadAsPromise(): Promise<LoadBillingResponse> {
    return lastValueFrom(this.loadBillingDetails());
  }

  changeBillingType(billingType: BillingType): Observable<LoadBillingResponse> {
    const url = `${this.baseUrl}/actions?billingType=${billingType}`;

    return this.http.post<LoadBillingResponse>(url, {});
  }

  deleteInsurance(insuranceId?: string) {
    const url = `${this.baseUrl}/insurances?id=${insuranceId}`;

    return this.http.delete<LoadBillingResponse>(url, {});
  }

  updateInsurance(insuranceId?: string, data?: InsuranceForm): Observable<LoadBillingResponse> {
    const url = `${this.baseUrl}/insurances?id=${insuranceId}`;

    return this.http.put<LoadBillingResponse>(url, data, {});
  }
  
  createInsurance(data: InsuranceForm): Observable<LoadBillingResponse> {
    const url = `${this.baseUrl}/insurances`;

    return this.http.post<LoadBillingResponse>(url, data, {});
  }

  createInsurances(data: InsuranceForm[]): Observable<LoadBillingResponse> {
    const url = `${this.baseUrl}/insurances`;

    return this.http.put<LoadBillingResponse>(url, data, {});
  }
}
