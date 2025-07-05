import { render, screen } from '@testing-library/react';
import Home from './page';

describe('Home', () => {
  it('renders a welcome message', () => {
    render(<Home />);
    expect(screen.getByText('Welcome to Letter Unboxed!')).toBeInTheDocument();
  });
});
