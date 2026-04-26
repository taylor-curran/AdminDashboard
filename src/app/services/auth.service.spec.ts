import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.setItem('currentUser', 'null');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.removeItem('currentUser');
  });

  it('login returns true and stores user when password matches', (done) => {
    service.login('a@b.com', 'secret12').subscribe((ok) => {
      expect(ok).toBeTrue();
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getCurrentUser().email).toBe('a@b.com');
      done();
    });
    const req = httpMock.expectOne(
      (r) => r.url.startsWith('http://localhost:3000/users') && r.url.includes('a@b.com')
    );
    expect(req.request.method).toBe('GET');
    req.flush([{ email: 'a@b.com', password: 'secret12', roles: [] }]);
  });

  it('login returns false when no user', (done) => {
    service.login('x@y.com', 'p').subscribe((ok) => {
      expect(ok).toBeFalse();
      done();
    });
    httpMock
      .expectOne((r) => r.url.includes('x@y.com'))
      .flush([]);
  });

  it('login returns false when password mismatch', (done) => {
    service.login('a@b.com', 'wrong').subscribe((ok) => {
      expect(ok).toBeFalse();
      done();
    });
    httpMock
      .expectOne((r) => r.url.includes('a@b.com'))
      .flush([{ email: 'a@b.com', password: 'right', roles: [] }]);
  });
});
