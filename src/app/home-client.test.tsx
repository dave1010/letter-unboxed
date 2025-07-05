import { render, screen, fireEvent } from '@testing-library/react';
import Home from '../app/home-client';
import { describe, it, expect, vi } from 'vitest';


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

  it('renders the main heading', () => {
    render(<Home wordList={mockWordList} />);
    expect(screen.getByText('Letter Unboxed')).toBeInTheDocument();
  });

  it('initializes letter statuses to unavailable', () => {
    render(<Home wordList={mockWordList} />);
    // Check a few letters to ensure they are initially unavailable (red background)
    expect(screen.getByRole('button', { name: 'A' })).toHaveStyle('background-color: #f8d7da');
    expect(screen.getByRole('button', { name: 'Z' })).toHaveStyle('background-color: #f8d7da');
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
    expect(getByText('Select Available Letters')).toBeInTheDocument();

    // Check if WordResults is rendered (by checking one of its internal elements)
    expect(getByText(/Results \(\d+\)/)).toBeInTheDocument();
  });
});
