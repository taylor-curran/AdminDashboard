import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null when no user in localStorage', () => {
    expect(service.getCurrentUser()).toBeNull();
  });

  it('should return false for isAuthenticated when no user', () => {
    expect(service.isAuthenticated()).toBeFalse();
  });

  it('should clear currentUser on logout', () => {
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ id: '1', firstName: 'Admin' })
    );
    service.logout();
    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(service.isAuthenticated()).toBeFalse();
  });
});

describe('AuthService (with pre-set user)', () => {
  let service: AuthService;

  beforeEach(() => {
    localStorage.clear();
    const user = {
      id: '1',
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@mail.com',
      password: 'admin',
      roles: ['Administrator'],
    };
    localStorage.setItem('currentUser', JSON.stringify(user));

    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should return true for isAuthenticated when user is in localStorage', () => {
    expect(service.isAuthenticated()).toBeTrue();
  });

  it('should return the user from getCurrentUser', () => {
    const user = service.getCurrentUser();
    expect(user).toBeTruthy();
    expect(user.email).toBe('admin@mail.com');
  });
});
