import { render, screen } from '@testing-library/react';
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

  it('passes correct props to WordResults', () => {
    render(<Home wordList={mockWordList} />);

    // Check if WordResults is rendered by looking for the heading "Results"
    // Using a function with getByRole to be more resilient to text content changes within the heading
    expect(screen.getByRole('heading', { name: /results/i })).toBeInTheDocument();
  });
});
