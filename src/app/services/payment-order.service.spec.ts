import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { PaymentOrderService } from './payment-order.service';

describe('PaymentOrderService', () => {
  let service: PaymentOrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentOrderService],
    });
    service = TestBed.inject(PaymentOrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getPaymentOrders issues GET /paymentOrders', (done) => {
    service.getPaymentOrders().subscribe((rows) => {
      expect(rows.length).toBe(1);
      expect(rows[0].id).toBe('1');
      done();
    });
    const req = httpMock.expectOne('http://localhost:3000/paymentOrders');
    expect(req.request.method).toBe('GET');
    req.flush([{ id: '1', status: 'Created' }]);
  });

  it('getPaymentOrderById issues GET /paymentOrders/:id', (done) => {
    service.getPaymentOrderById('5').subscribe((row) => {
      expect(row.id).toBe('5');
      done();
    });
    const req = httpMock.expectOne('http://localhost:3000/paymentOrders/5');
    expect(req.request.method).toBe('GET');
    req.flush({ id: '5', status: 'Successful' });
  });
});
