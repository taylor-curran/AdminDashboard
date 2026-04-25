import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { PaymentOrderService } from '../../src/app/services/payment-order.service';

describe('PaymentOrderService HTTP shape', () => {
  let service: PaymentOrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentOrderService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(PaymentOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getPaymentOrders -> GET /paymentOrders', async () => {
    const promise = firstValueFrom(service.getPaymentOrders());
    const req = httpMock.expectOne('http://localhost:3000/paymentOrders');
    expect(req.request.method).toBe('GET');
    req.flush([]);
    await promise;
  });

  it('getPaymentOrderById -> GET /paymentOrders/:id', async () => {
    const promise = firstValueFrom(service.getPaymentOrderById('7'));
    const req = httpMock.expectOne('http://localhost:3000/paymentOrders/7');
    expect(req.request.method).toBe('GET');
    req.flush({});
    await promise;
  });
});
