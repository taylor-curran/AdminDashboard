import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { UsersComponent } from '../../src/app/pages/users/users.component';

const seed = [
  {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    password: 'Password123!',
    roles: ['Customer'],
    createdOn: '2024-06-01T12:00:00Z',
  },
];

describe('UsersComponent', () => {
  let fixture: ComponentFixture<UsersComponent>;
  let component: UsersComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('loads users via GET /users on init', fakeAsync(() => {
    fixture.detectChanges();
    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush(seed);
    tick();
    expect(component.users.length).toBe(1);
    expect(component.users[0].email).toBe('john.doe@example.com');
  }));

  it('marks the form invalid when required fields are empty', () => {
    expect(component.userForm.valid).toBeFalse();
    expect(component.userForm.controls['firstName'].errors?.['required']).toBeTrue();
    expect(component.userForm.controls['email'].errors?.['required']).toBeTrue();
    expect(component.userForm.controls['password'].errors?.['required']).toBeTrue();
  });

  it('flags weak passwords with passwordStrength error', () => {
    component.userForm.controls['password'].setValue('weakpass');
    expect(
      component.userForm.controls['password'].errors?.['passwordStrength'],
    ).toBeTrue();
  });

  it('creates a user via POST /users when the form is submitted', fakeAsync(() => {
    fixture.detectChanges();
    httpMock.expectOne('http://localhost:3000/users').flush(seed);
    tick();

    component.userForm.setValue({
      firstName: 'Test',
      lastName: 'User',
      email: 'test.user@example.com',
      password: 'Password123!',
      roles: [],
    });
    component.submitForm();

    const req = httpMock.expectOne(
      (r) => r.url === 'http://localhost:3000/users' && r.method === 'POST',
    );
    expect(req.request.body.firstName).toBe('Test');
    expect(req.request.body.email).toBe('test.user@example.com');
    expect(req.request.body.roles).toEqual([]);
    req.flush({ id: 'x' });
    tick();
    // Refresh GET after create
    httpMock.expectOne('http://localhost:3000/users').flush(seed);
    tick();
  }));
});
