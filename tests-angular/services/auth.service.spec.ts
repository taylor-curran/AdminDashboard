import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../../src/app/services/auth.service';

const adminUser = {
  id: '3ad5',
  firstName: 'admin',
  lastName: 'admin',
  email: 'admin@mail.com',
  password: 'admin',
  roles: ['Administrator'],
  createdOn: '2024-07-03T19:22:15.464Z',
};

describe('AuthService (Angular reference)', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('issues GET /users?email=… and stores user on successful login', async () => {
    const promise = firstValueFrom(
      service.login('admin@mail.com', 'admin'),
    );

    const req = httpMock.expectOne(
      'http://localhost:3000/users?email=admin@mail.com',
    );
    expect(req.request.method).toBe('GET');
    req.flush([adminUser]);

    expect(await promise).toBeTrue();
    expect(service.isAuthenticated()).toBeTrue();
    expect(service.getCurrentUser().email).toBe('admin@mail.com');
    expect(JSON.parse(localStorage.getItem('currentUser')!).email).toBe(
      'admin@mail.com',
    );
  });

  it('returns false when password is wrong', async () => {
    const promise = firstValueFrom(
      service.login('admin@mail.com', 'wrong'),
    );
    httpMock
      .expectOne('http://localhost:3000/users?email=admin@mail.com')
      .flush([adminUser]);

    expect(await promise).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('returns false when user is not found', async () => {
    const promise = firstValueFrom(service.login('nope@mail.com', 'x'));
    httpMock
      .expectOne('http://localhost:3000/users?email=nope@mail.com')
      .flush([]);
    expect(await promise).toBeFalse();
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('clears the current user on logout', async () => {
    const promise = firstValueFrom(
      service.login('admin@mail.com', 'admin'),
    );
    httpMock
      .expectOne('http://localhost:3000/users?email=admin@mail.com')
      .flush([adminUser]);
    await promise;
    expect(service.isAuthenticated()).toBeTrue();

    service.logout();

    expect(service.isAuthenticated()).toBeFalse();
    expect(service.getCurrentUser()).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });
});
