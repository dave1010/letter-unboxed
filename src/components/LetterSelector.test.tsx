import { render, screen, fireEvent } from '@testing-library/react';
import LetterSelector from '../components/LetterSelector';
import { describe, it, expect, vi } from 'vitest';

describe('LetterSelector', () => {
  const initialLetterStatuses = {
    a: 'unavailable', b: 'available', c: 'required',
    // ... rest of alphabet as unavailable for brevity
    d: 'unavailable', e: 'unavailable', f: 'unavailable', g: 'unavailable', h: 'unavailable',
    i: 'unavailable', j: 'unavailable', k: 'unavailable', l: 'unavailable', m: 'unavailable',
    n: 'unavailable', o: 'unavailable', p: 'unavailable', q: 'unavailable', r: 'unavailable',
    s: 'unavailable', t: 'unavailable', u: 'unavailable', v: 'unavailable', w: 'unavailable',
    x: 'unavailable', y: 'unavailable', z: 'unavailable',
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

    // Check 'unavailable' (default)
    expect(screen.getByRole('button', { name: 'A' })).toHaveStyle('background-color: #f8d7da');
    expect(screen.getByRole('button', { name: 'A' })).toHaveStyle('color: #721c24');

    // Check 'available'
    expect(screen.getByRole('button', { name: 'B' })).toHaveStyle('background-color: #cfe2ff');
    expect(screen.getByRole('button', { name: 'B' })).toHaveStyle('color: #055160');

    // Check 'required'
    expect(screen.getByRole('button', { name: 'C' })).toHaveStyle('background-color: #d4edda');
    expect(screen.getByRole('button', { name: 'C' })).toHaveStyle('color: #155724');
  });
});
