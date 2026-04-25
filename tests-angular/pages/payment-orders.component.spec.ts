import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { PaymentOrdersComponent } from '../../src/app/pages/payment-orders/payment-orders.component';

const sampleOrders = [
  {
    id: '1',
    paymentReference: 'PAY123456',
    title: 'Order #1',
    description: 'desc',
    status: 'Successful',
    amount: 100.5,
    currency: 'USD',
    customerData: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phoneNumber: '+1',
      streetAddress: 'x',
      postalCode: '0',
      city: 'x',
      country: 'x',
    },
    createdOn: '2024-06-15T08:00:00Z',
    paidOn: '2024-06-16T08:00:00Z',
    authorizationCode: 'AUTH123456',
  },
];

describe('PaymentOrdersComponent', () => {
  let fixture: ComponentFixture<PaymentOrdersComponent>;
  let component: PaymentOrdersComponent;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentOrdersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentOrdersComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
  });

  afterEach(() => httpMock.verify());

  it('issues GET /paymentOrders on init and assigns rows', fakeAsync(() => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:3000/paymentOrders');
    expect(req.request.method).toBe('GET');
    req.flush(sampleOrders);
    tick();
    expect(component.paymentOrders.length).toBe(1);
    expect(component.paymentOrders[0].paymentReference).toBe('PAY123456');
  }));

  it('navigates to /payment-orders/:id when viewDetails is called', () => {
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:3000/paymentOrders').flush(sampleOrders);

    component.viewDetails(sampleOrders[0] as any);

    expect(router.navigate).toHaveBeenCalledWith(['/payment-orders', '1']);
  });
});
