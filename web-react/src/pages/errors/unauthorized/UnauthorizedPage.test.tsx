import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { UnauthorizedPage } from './UnauthorizedPage';

describe('UnauthorizedPage', () => {
  it('should render 401 heading', () => {
    render(
      <BrowserRouter>
        <UnauthorizedPage />
      </BrowserRouter>
    );
    expect(screen.getByText('401 - Unauthorized')).toBeInTheDocument();
  });

  it('should have a link to login page', () => {
    render(
      <BrowserRouter>
        <UnauthorizedPage />
      </BrowserRouter>
    );
    const link = screen.getByText('Login');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/login');
  });
});
