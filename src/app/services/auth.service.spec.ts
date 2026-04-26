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
    localStorage.clear();
    localStorage.setItem('currentUser', 'null');
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('login returns true and stores user on valid credentials', (done) => {
    service.login('a@b.com', 'secret').subscribe((ok) => {
      expect(ok).toBe(true);
      const stored = JSON.parse(localStorage.getItem('currentUser')!);
      expect(stored.email).toBe('a@b.com');
      done();
    });
    const req = httpMock.expectOne(
      (r) => r.url.includes('/users') && r.url.includes('email=')
    );
    expect(req.request.method).toBe('GET');
    req.flush([{ email: 'a@b.com', password: 'secret', roles: ['Admin'] }]);
  });

  it('login returns false when password wrong', (done) => {
    service.login('a@b.com', 'wrong').subscribe((ok) => {
      expect(ok).toBe(false);
      done();
    });
    const req = httpMock.expectOne(
      (r) => r.url.includes('/users') && r.url.includes('email=')
    );
    req.flush([{ email: 'a@b.com', password: 'secret', roles: [] }]);
  });
});
