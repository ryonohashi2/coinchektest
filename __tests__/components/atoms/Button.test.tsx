import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

// サンプルButtonコンポーネント（実装前の雛形）
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  disabled = false 
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
      data-testid="button"
    >
      {children}
    </button>
  );
};

describe('Button Component', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByTestId('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct variant class', () => {
    render(<Button variant="secondary">Secondary Button</Button>);
    expect(screen.getByTestId('button')).toHaveClass('btn-secondary');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    expect(screen.getByTestId('button')).toBeDisabled();
  });
});