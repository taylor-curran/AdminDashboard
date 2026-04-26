import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { StatisticsComponent } from './statistics.component';
import { PaymentOrderService } from '../../services/payment-order.service';
import { UserService } from '../../services/user.service';

describe('StatisticsComponent', () => {
  let fixture: ComponentFixture<StatisticsComponent>;
  let paymentOrderService: jasmine.SpyObj<PaymentOrderService>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    paymentOrderService = jasmine.createSpyObj('PaymentOrderService', [
      'getPaymentOrders',
    ]);
    userService = jasmine.createSpyObj('UserService', ['getUsers']);

    paymentOrderService.getPaymentOrders.and.returnValue(
      of([
        {
          id: '1',
          paymentReference: 'P1',
          title: 'T',
          description: 'D',
          status: 'Successful',
          amount: 1,
          currency: 'USD',
          customerData: {
            firstName: 'A',
            lastName: 'B',
            email: 'a@b.com',
            phoneNumber: '1',
            streetAddress: 's',
            postalCode: '1',
            city: 'c',
            country: 'US',
          },
          createdOn: new Date('2024-06-01'),
          paidOn: new Date('2024-06-02'),
        },
      ] as any)
    );
    userService.getUsers.and.returnValue(
      of([
        {
          id: '1',
          firstName: 'U',
          lastName: 'V',
          email: 'u@v.com',
          password: 'x',
          roles: ['Customer'],
          createdOn: new Date('2024-06-03'),
        },
      ] as any)
    );

    await TestBed.configureTestingModule({
      imports: [StatisticsComponent],
      providers: [
        { provide: PaymentOrderService, useValue: paymentOrderService },
        { provide: UserService, useValue: userService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsComponent);
    fixture.detectChanges();
  });

  it('loads orders and users and builds chart datasets', () => {
    const comp = fixture.componentInstance;
    expect(paymentOrderService.getPaymentOrders).toHaveBeenCalled();
    expect(userService.getUsers).toHaveBeenCalled();
    expect(comp.paymentOrders.length).toBe(1);
    expect(comp.users.length).toBe(1);
    expect(comp.transactionChartData?.datasets?.[0]?.label).toBe(
      'Successful Transactions'
    );
    expect(comp.usersChartData?.datasets?.[0]?.label).toBe('New Users');
    expect(comp.paymentStatusChartData?.labels).toEqual([
      'Successful',
      'Unsuccessful',
      'Created',
    ]);
  });

  it('getLast30DaysData returns 30 labels aligned with counts', () => {
    const comp = fixture.componentInstance;
    const out = comp.getLast30DaysData([new Date()]);
    expect(out.labels.length).toBe(30);
    expect(out.counts.length).toBe(30);
  });
});
