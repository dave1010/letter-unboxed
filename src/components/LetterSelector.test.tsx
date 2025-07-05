import { render, screen, fireEvent } from '@testing-library/react';
import LetterSelector from '../components/LetterSelector';
import { describe, it, expect, vi } from 'vitest';

describe('LetterSelector', () => {
  const initialLetterStatuses = {
    a: 'excluded', b: 'available', c: 'required-anywhere',
    // ... rest of alphabet as excluded for brevity
    d: 'excluded', e: 'excluded', f: 'excluded', g: 'excluded', h: 'excluded',
    i: 'excluded', j: 'excluded', k: 'excluded', l: 'excluded', m: 'excluded',
    n: 'excluded', o: 'excluded', p: 'excluded', q: 'excluded', r: 'excluded',
    s: 'excluded', t: 'excluded', u: 'excluded', v: 'excluded', w: 'excluded',
    x: 'excluded', y: 'excluded', z: 'excluded',
  };

  it('renders all alphabet letters', () => {
    const onLetterClick = vi.fn();
    render(<LetterSelector letterStatuses={initialLetterStatuses} onLetterClick={onLetterClick} />);
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(char => {
      expect(screen.getByRole('button', { name: char.toUpperCase() })).toBeInTheDocument();
    });
  });

  it('calls onLetterClick with the correct character when a button is clicked', () => {
    const onLetterClick = vi.fn();
    render(<LetterSelector letterStatuses={initialLetterStatuses} onLetterClick={onLetterClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    expect(onLetterClick).toHaveBeenCalledWith('a');
  });

  it('applies correct styling based on letter status', () => {
    const onLetterClick = vi.fn();
    render(<LetterSelector letterStatuses={initialLetterStatuses} onLetterClick={onLetterClick} />);

    // Check 'excluded' (default)
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass('bg-gray-600', 'text-gray-300', 'border-gray-700');

    // Check 'available'
    expect(screen.getByRole('button', { name: 'B' })).toHaveClass(
      'bg-gradient-to-br',
      'from-blue-500',
      'to-blue-700',
      'text-white',
      'border-blue-700',
      'text-center'
    );

    // Check 'required-anywhere'
    expect(screen.getByRole('button', { name: 'C' })).toHaveClass(
      'bg-gradient-to-br',
      'from-green-600',
      'to-green-800',
      'text-white',
      'border-green-800',
      'text-center'
    );
  });
});
