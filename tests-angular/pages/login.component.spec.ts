import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { LoginComponent } from '../../src/app/pages/login/login.component';

const adminUser = {
  id: '3ad5',
  firstName: 'admin',
  lastName: 'admin',
  email: 'admin@mail.com',
  password: 'admin',
  roles: ['Administrator'],
  createdOn: '2024-07-03T19:22:15.464Z',
};

describe('LoginComponent', () => {
  let fixture: ComponentFixture<LoginComponent>;
  let component: LoginComponent;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        provideNoopAnimations(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('renders the login form', () => {
    const html = fixture.nativeElement.innerHTML;
    expect(html).toContain('Login');
    expect(fixture.nativeElement.querySelector('input#email')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('input#password')).toBeTruthy();
  });

  it('logs in successfully and navigates to /home', fakeAsync(() => {
    component.loginForm.setValue({
      email: 'admin@mail.com',
      password: 'admin',
    });
    component.onSubmit();

    const req = httpMock.expectOne(
      'http://localhost:3000/users?email=admin@mail.com',
    );
    req.flush([adminUser]);
    tick();

    expect(router.navigate).toHaveBeenCalledWith(['/home']);
    expect(component.errorMessage).toBe('');
  }));

  it('shows an error message on bad credentials', fakeAsync(() => {
    component.loginForm.setValue({
      email: 'nope@mail.com',
      password: 'badpass',
    });
    component.onSubmit();

    httpMock
      .expectOne('http://localhost:3000/users?email=nope@mail.com')
      .flush([]);
    tick();

    expect(component.errorMessage).toBe('Invalid email or password');
    expect(router.navigate).not.toHaveBeenCalled();
  }));

  it('does not submit when the form is invalid', () => {
    component.loginForm.setValue({ email: '', password: '' });
    component.onSubmit();
    httpMock.expectNone(() => true);
  });
});
