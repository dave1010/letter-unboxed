import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LetterGroupsDisplay from '../components/LetterGroupsDisplay';

describe('LetterGroupsDisplay', () => {
  const letterStatuses = {
    a: 'available',
    b: 'required-anywhere',
    c: 'excluded',
  } as const;

  it('renders letter buttons as squares', () => {
    render(
      <LetterGroupsDisplay
        letterStatuses={letterStatuses}
        letterGroups="a,b"
        onGroupsChange={() => {}}
        onShowLetters={() => {}}
      />
    );
    const letterButton = screen.getByRole('button', { name: 'A' });
    expect(letterButton).toHaveClass('aspect-square');
  });

  it('renders Letters button with large text', () => {
    render(
      <LetterGroupsDisplay
        letterStatuses={letterStatuses}
        letterGroups="a,b"
        onGroupsChange={() => {}}
        onShowLetters={() => {}}
      />
    );
    const lettersButton = screen.getByRole('button', { name: 'Letters' });
    expect(lettersButton).toHaveClass('text-lg', 'px-4');
  });

  it('draggable letter buttons have tabIndex -1', () => {
    render(
      <LetterGroupsDisplay
        letterStatuses={letterStatuses}
        letterGroups="a,b"
        onGroupsChange={() => {}}
        onShowLetters={() => {}}
      />
    );
    const letterButton = screen.getByRole('button', { name: 'A' });
    expect(letterButton).toHaveAttribute('tabindex', '-1');
  });
});
