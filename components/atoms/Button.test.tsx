import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

test('Button renders children', () => {
  render(<Button>Click me</Button>);
  expect(screen.getByText('Click me')).toBeInTheDocument();
}); 