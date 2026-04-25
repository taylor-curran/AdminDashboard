import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { NotFoundPage } from './NotFoundPage';

describe('NotFoundPage', () => {
  it('should render 404 heading', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(screen.getByText('404 - Not Found')).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    expect(
      screen.getByText(
        "Oops, it looks like the page you're looking for doesn't exist."
      )
    ).toBeInTheDocument();
  });

  it('should have a link to homepage', () => {
    render(
      <BrowserRouter>
        <NotFoundPage />
      </BrowserRouter>
    );
    const link = screen.getByText('Go to Homepage');
    expect(link).toBeInTheDocument();
    expect(link.getAttribute('href')).toBe('/home');
  });
});
