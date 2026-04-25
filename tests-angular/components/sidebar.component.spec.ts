import { TestBed, ComponentFixture } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { SidebarComponent } from '../../src/app/components/sidebar/sidebar.component';
import { AuthService } from '../../src/app/services/auth.service';

describe('SidebarComponent', () => {
  let fixture: ComponentFixture<SidebarComponent>;
  let component: SidebarComponent;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        AuthService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('renders nav links to all primary routes', () => {
    const links = fixture.nativeElement.querySelectorAll('a.link');
    const hrefs = Array.from(links).map((a: any) => a.getAttribute('href'));
    expect(hrefs).toContain('/home');
    expect(hrefs).toContain('/payment-orders');
    expect(hrefs).toContain('/users');
  });

  it('shows Login button when unauthenticated', () => {
    expect(component.isLoggedIn).toBeFalse();
    const btnText = fixture.nativeElement.textContent || '';
    expect(btnText).toContain('Login');
    expect(btnText).not.toContain('Logout');
  });

  it('shows Logout button when authenticated', () => {
    const auth = TestBed.inject(AuthService) as any;
    auth['currentUserSubject'].next({
      id: '3ad5',
      email: 'admin@mail.com',
      roles: ['Administrator'],
    });
    fixture.detectChanges();

    const btnText = fixture.nativeElement.textContent || '';
    expect(component.isLoggedIn).toBeTrue();
    expect(btnText).toContain('Logout');
    expect(btnText).not.toContain('Login');
  });

  it('clears the current user when Logout is clicked', () => {
    const auth = TestBed.inject(AuthService) as any;
    auth['currentUserSubject'].next({
      id: '3ad5',
      email: 'admin@mail.com',
      roles: ['Administrator'],
    });
    localStorage.setItem('currentUser', JSON.stringify({ id: '3ad5' }));
    fixture.detectChanges();

    const router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    component.logout();

    expect(localStorage.getItem('currentUser')).toBeNull();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
