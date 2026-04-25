import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { User, UserService } from '../../src/app/services/user.service';

const sampleUser: User = {
  id: '100',
  firstName: 'Test',
  lastName: 'User',
  email: 'test.user@example.com',
  password: 'Password123!',
  roles: ['Customer'],
  createdOn: new Date('2024-07-04T00:00:00.000Z'),
};

describe('UserService HTTP shape', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserService,
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getUsers -> GET /users', async () => {
    const promise = firstValueFrom(service.getUsers());
    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('GET');
    req.flush([]);
    await promise;
  });

  it('getUserById -> GET /users/:id', async () => {
    const promise = firstValueFrom(service.getUserById('100'));
    const req = httpMock.expectOne('http://localhost:3000/users/100');
    expect(req.request.method).toBe('GET');
    req.flush(sampleUser);
    await promise;
  });

  it('createUser -> POST /users with JSON body', async () => {
    const promise = firstValueFrom(service.createUser(sampleUser));
    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(sampleUser);
    req.flush(sampleUser);
    await promise;
  });

  it('updateUser -> PUT /users/:id with JSON body', async () => {
    const promise = firstValueFrom(service.updateUser('100', sampleUser));
    const req = httpMock.expectOne('http://localhost:3000/users/100');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(sampleUser);
    req.flush(sampleUser);
    await promise;
  });

  it('deleteUser -> DELETE /users/:id', async () => {
    const promise = firstValueFrom(service.deleteUser('100'));
    const req = httpMock.expectOne('http://localhost:3000/users/100');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
    await promise;
  });
});
