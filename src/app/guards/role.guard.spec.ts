import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { roleGuard } from './role.guard';
import { AuthService } from '../services/auth.service';

describe('roleGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
      ],
    });
  });

  it('allows Administrator', () => {
    authService.getCurrentUser.and.returnValue({
      roles: ['Administrator'],
    } as any);
    const result = TestBed.runInInjectionContext(() =>
      roleGuard({} as any, {} as any)
    );
    expect(result).toBe(true);
  });

  it('redirects to 403 for non-admin', () => {
    authService.getCurrentUser.and.returnValue({
      roles: ['Customer'],
    } as any);
    const result = TestBed.runInInjectionContext(() =>
      roleGuard({} as any, {} as any)
    );
    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/403']);
  });
});
