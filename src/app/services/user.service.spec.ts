import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('createUser issues POST /users with body', (done) => {
    const payload = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      password: 'Abcd1234!',
      roles: ['Customer'],
      createdOn: new Date(),
    };
    service.createUser(payload as any).subscribe(() => done());
    const req = httpMock.expectOne('http://localhost:3000/users');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(jasmine.objectContaining({ email: 'a@b.com' }));
    req.flush({ ...payload, id: '99' });
  });

  it('updateUser issues PUT /users/:id', (done) => {
    const u = {
      firstName: 'A',
      lastName: 'B',
      email: 'a@b.com',
      password: 'Abcd1234!',
      roles: ['Administrator'],
      createdOn: new Date(),
    };
    service.updateUser('7', u as any).subscribe(() => done());
    const req = httpMock.expectOne('http://localhost:3000/users/7');
    expect(req.request.method).toBe('PUT');
    req.flush({ ...u, id: '7' });
  });

  it('deleteUser issues DELETE /users/:id', (done) => {
    service.deleteUser('3').subscribe(() => done());
    const req = httpMock.expectOne('http://localhost:3000/users/3');
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
