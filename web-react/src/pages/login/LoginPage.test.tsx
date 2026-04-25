import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../../context/AuthContext';
import { LoginPage } from './LoginPage';

vi.mock('../../services/authService', () => ({
  authService: {
    getCurrentUser: () => null,
    isAuthenticated: () => false,
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

function renderLoginPage() {
  return render(
    <BrowserRouter>
      <AuthProvider>
        <LoginPage />
      </AuthProvider>
    </BrowserRouter>
  );
}

describe('LoginPage', () => {
  it('should render login form with email and password fields', () => {
    renderLoginPage();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should render login button', () => {
    renderLoginPage();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('should render Login heading', () => {
    renderLoginPage();
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument();
  });
});
