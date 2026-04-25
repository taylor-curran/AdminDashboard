import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { convertToParamMap } from '@angular/router';

import { PaymentOrderDetailsComponent } from '../../src/app/pages/payment-order-details/payment-order-details.component';

const successfulOrder = {
  id: '1',
  paymentReference: 'PAY123456',
  title: 'Order #1',
  description: 'Payment for monthly subscription',
  status: 'Successful',
  amount: 100.5,
  currency: 'USD',
  customerData: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '+1234567890',
    streetAddress: '123 Main St',
    postalCode: '12345',
    city: 'Springfield',
    country: 'USA',
  },
  createdOn: '2024-06-15T08:00:00Z',
  paidOn: '2024-06-16T08:00:00Z',
  authorizationCode: 'AUTH123456',
};

const createdOrder = { ...successfulOrder, id: '2', status: 'Created' };

function configure(orderId: string) {
  return TestBed.configureTestingModule({
    imports: [PaymentOrderDetailsComponent],
    providers: [
      provideHttpClient(),
      provideHttpClientTesting(),
      provideRouter([]),
      provideNoopAnimations(),
      {
        provide: ActivatedRoute,
        useValue: {
          snapshot: { paramMap: convertToParamMap({ id: orderId }) },
        },
      },
    ],
  }).compileComponents();
}

describe('PaymentOrderDetailsComponent', () => {
  let fixture: ComponentFixture<PaymentOrderDetailsComponent>;
  let httpMock: HttpTestingController;

  it('issues GET /paymentOrders/:id and renders order fields', fakeAsync(async () => {
    await configure('1');
    fixture = TestBed.createComponent(PaymentOrderDetailsComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne('http://localhost:3000/paymentOrders/1');
    expect(req.request.method).toBe('GET');
    req.flush(successfulOrder);
    tick();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent || '';
    expect(text).toContain('Order #1');
    expect(text).toContain('Payment for monthly subscription');
    expect(text).toContain('Reference: PAY123456');
    expect(text).toContain('Successful');
    expect(text).toContain('100.5');
    expect(text).toContain('USD');
    expect(text).toContain('John');
    expect(text).toContain('Doe');
    expect(text).toContain('AUTH123456');
    httpMock.verify();
  }));

  it('hides Paid On and Authorization Code for non-Successful orders', fakeAsync(async () => {
    await configure('2');
    fixture = TestBed.createComponent(PaymentOrderDetailsComponent);
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    httpMock
      .expectOne('http://localhost:3000/paymentOrders/2')
      .flush(createdOrder);
    tick();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent || '';
    expect(text).not.toContain('Paid On');
    expect(text).not.toContain('Authorization Code');
    httpMock.verify();
  }));
});
