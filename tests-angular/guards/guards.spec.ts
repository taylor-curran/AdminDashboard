import { TestBed } from '@angular/core/testing';
import { Router, type ActivatedRouteSnapshot, type RouterStateSnapshot } from '@angular/router';

import { authGuard } from '../../src/app/guards/auth.guard';
import { roleGuard } from '../../src/app/guards/role.guard';
import { loginGuard } from '../../src/app/guards/login.guard';
import { AuthService } from '../../src/app/services/auth.service';

class StubRouter {
  navigate = jasmine.createSpy('navigate');
}

class StubAuthService {
  user: any = null;
  isAuthenticated() {
    return !!this.user;
  }
  getCurrentUser() {
    return this.user;
  }
}

function run(guard: any): boolean {
  return TestBed.runInInjectionContext(() =>
    guard(
      {} as ActivatedRouteSnapshot,
      {} as RouterStateSnapshot,
    ),
  ) as boolean;
}

describe('Guards', () => {
  let router: StubRouter;
  let auth: StubAuthService;

  beforeEach(() => {
    router = new StubRouter();
    auth = new StubAuthService();
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: AuthService, useValue: auth },
      ],
    });
  });

  describe('authGuard', () => {
    it('redirects to /401 when unauthenticated', () => {
      expect(run(authGuard)).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/401']);
    });

    it('passes when authenticated', () => {
      auth.user = { roles: ['Customer'] };
      expect(run(authGuard)).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('roleGuard', () => {
    it('redirects to /403 when user is not Administrator', () => {
      auth.user = { roles: ['Customer'] };
      expect(run(roleGuard)).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/403']);
    });

    it('redirects to /403 when user is missing', () => {
      expect(run(roleGuard)).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/403']);
    });

    it('passes when user has Administrator role', () => {
      auth.user = { roles: ['Administrator'] };
      expect(run(roleGuard)).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  describe('loginGuard', () => {
    it('redirects to /home when already authenticated', () => {
      auth.user = { roles: ['Administrator'] };
      expect(run(loginGuard)).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/home']);
    });

    it('passes when not authenticated', () => {
      expect(run(loginGuard)).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
