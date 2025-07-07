import { render, screen } from '@testing-library/react';
import WordResults from '../components/WordResults';
import { describe, it, expect } from 'vitest';

describe('WordResults', () => {
  it('renders a list of words when provided', () => {
    const words = ['apple', 'banana', 'cherry'];
    render(<WordResults results={words} lettersSelected={true} />);

    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
    expect(screen.getByText('cherry')).toBeInTheDocument();
    expect(screen.queryByText('No words found for the selected letters.')).not.toBeInTheDocument();
  });

  it('displays a message when no words are found', () => {
    render(<WordResults results={[]} lettersSelected={true} />);

    expect(screen.getByText('No words found for the selected letters.')).toBeInTheDocument();
    expect(screen.queryByText('apple')).not.toBeInTheDocument();
  });

  it('prompts to select letters when none are available', () => {
    render(<WordResults results={[]} lettersSelected={false} />);

    expect(
      screen.getByText(
        'Tap letters to make them available. Tap again to require words to use them at the start, anywhere in the word or at the end.',
      ),
    ).toBeInTheDocument();
  });

  it('uses smaller text for words 15 characters or longer', () => {
    const words = ['short', 'averyverylonglongword'];
    render(<WordResults results={words} lettersSelected={true} />);

    expect(screen.getByText('averyverylonglongword')).toHaveClass('text-sm');
    expect(screen.getByText('short')).not.toHaveClass('text-sm');
  });

  
});
