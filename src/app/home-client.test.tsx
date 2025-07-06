import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Home from '../app/home-client';
import { describe, it, expect, vi } from 'vitest';
import { encodeState, decodeState } from '../lib/urlState';
import type { LetterStatus } from '../components/letterStyles';


// Mock the Dictionary class
vi.mock('../lib/dictionary', () => ({
  Dictionary: vi.fn().mockImplementation((...words: string[]) => ({
    filter: vi.fn((available, required, unavailable) => {
      // Simple mock filtering logic for testing
      return words.filter(word => {
        const wordChars = new Set(word.split(''));
        const availableSet = new Set(available.split(''));
        const requiredSet = new Set(required.split(''));
        const unavailableSet = new Set(unavailable.split(''));
        const allowedLettersSet = new Set([...availableSet, ...requiredSet]);

        // Check for required letters
        for (const char of requiredSet) {
          if (!wordChars.has(char)) return false;
        }
        // Check for unavailable letters
        for (const char of unavailableSet) {
          if (wordChars.has(char)) return false;
        }
        // Check that all characters in the word are either available or required
        for (const char of wordChars) {
          if (!allowedLettersSet.has(char)) return false;
        }
        return true;
      });
    }),
  })),
}));

describe('Home', () => {
  const mockWordList = ['cat', 'dog', 'apple', 'banana', 'act', 'cot'];

  beforeEach(() => {
    window.location.hash = '';
  });

  it('renders the main heading', () => {
    render(<Home wordList={mockWordList} />);
    expect(screen.getByText('Letter Unboxed')).toBeInTheDocument();
  });

  it('initializes letter statuses to unavailable', () => {
    render(<Home wordList={mockWordList} />);
    // Check a few letters to ensure they are initially unavailable (greyed out)
    expect(screen.getByRole('button', { name: 'A' })).toHaveClass(
      'bg-gray-600',
      'text-gray-300',
      'border-gray-700'
    );
    expect(screen.getByRole('button', { name: 'Z' })).toHaveClass(
      'bg-gray-600',
      'text-gray-300',
      'border-gray-700'
    );
  });

  it('filters words based on letter status changes', async () => {
    render(<Home wordList={mockWordList} />);

    // Initially, no words should be found as all letters are unavailable
    expect(screen.getByText('No words found for the selected letters.')).toBeInTheDocument();

    // Click 'C' to make it available
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    // Click 'A' to make it available
    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    // Click 'T' to make it available
    fireEvent.click(screen.getByRole('button', { name: 'T' }));

    // Now 'cat' and 'act' should be visible
    expect(await screen.findByText('cat')).toBeInTheDocument();
    expect(screen.getByText('act')).toBeInTheDocument();
    expect(screen.queryByText('dog')).not.toBeInTheDocument();

    // Click 'C' again to make it required
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    // Now 'cat' and 'act' should be visible (as 'c' is required)
    expect(await screen.findByText('cat')).toBeInTheDocument();
    expect(screen.getByText('act')).toBeInTheDocument();

    // Click 'O' to make it available
    fireEvent.click(screen.getByRole('button', { name: 'O' }));
    // Now 'cot' should be visible as well
    expect(await screen.findByText('cot')).toBeInTheDocument();
  });

  it('passes correct props to LetterSelector and WordResults', () => {
    const { getByText } = render(<Home wordList={mockWordList} />);

    // Check if LetterSelector is rendered (by checking one of its internal elements)
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();

    // Check if WordResults is rendered (by checking one of its internal elements)
    expect(getByText(/Results \(\d+\)/)).toBeInTheDocument();
  });

  it('toggles group view when Groups and Letters buttons are clicked', () => {
    render(<Home wordList={mockWordList} />);

    // Groups button should be visible and group view hidden initially
    expect(screen.queryByRole('button', { name: 'Letters' })).not.toBeInTheDocument();
    const groupsButton = screen.getByRole('button', { name: 'Groups' });
    fireEvent.click(groupsButton);
    // Now group view should show and keyboard hidden
    expect(screen.getByRole('button', { name: 'Letters' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'A' })).not.toBeInTheDocument();
    const lettersButton = screen.getByRole('button', { name: 'Letters' });
    fireEvent.click(lettersButton);
    expect(screen.queryByRole('button', { name: 'Letters' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'A' })).toBeInTheDocument();
  });

  it('shows selected letters as individual groups', () => {
    render(<Home wordList={mockWordList} />);

    // make some letters available/required
    fireEvent.click(screen.getByRole('button', { name: 'B' }));
    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    fireEvent.click(screen.getByRole('button', { name: 'C' }));
    fireEvent.click(screen.getByRole('button', { name: 'C' }));

    fireEvent.click(screen.getByRole('button', { name: 'Groups' }));
    const letterButtons = screen
      .getAllByRole('button')
      .filter(btn => /^[A-Z]$/.test(btn.textContent || ''));
    const letters = letterButtons.map(btn => btn.textContent);
    expect(letters).toEqual(['A', 'B', 'C']);
  });

  it('updates URL fragment with current state', async () => {
    render(<Home wordList={mockWordList} />);
    fireEvent.click(screen.getByRole('button', { name: 'A' }));
    fireEvent.change(screen.getByLabelText('Sort:'), { target: { value: 'alphabetical-asc' } });
    await waitFor(() => {
      const state = decodeState(window.location.hash);
      expect(state.letterStatuses.a).toBe('available');
      expect(state.sortOrder).toBe('alphabetical-asc');
    });
  });

  it('initializes state from URL fragment', async () => {
    const statuses: Record<string, LetterStatus> = {};
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(c => { statuses[c] = 'excluded'; });
    statuses.b = 'required-anywhere';
    const encoded = encodeState(statuses, 'b,c', 'alphabetical-asc');
    window.location.hash = '#' + encoded;
    render(<Home wordList={mockWordList} />);
    const bBtn = await screen.findByRole('button', { name: 'B' });
    expect(bBtn).toHaveClass('border-green-800');
    expect((screen.getByLabelText('Sort:') as HTMLSelectElement).value).toBe('alphabetical-asc');
    fireEvent.click(screen.getByRole('button', { name: 'Groups' }));
    const letters = screen.getAllByRole('button').filter(btn => /^[A-Z]$/.test(btn.textContent || '')).map(btn => btn.textContent);
    expect(letters).toEqual(['B', 'C']);
  });
});
