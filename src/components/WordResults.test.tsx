import { render, screen } from '@testing-library/react';
import WordResults from '../components/WordResults';
import { describe, it, expect } from 'vitest';

describe('WordResults', () => {
  it('renders a list of words when provided', () => {
    const words = ['apple', 'banana', 'cherry'];
    render(<WordResults results={words} resultCount={words.length} onSortChange={() => {}} />);

    expect(screen.getByText('apple')).toBeInTheDocument();
    expect(screen.getByText('banana')).toBeInTheDocument();
    expect(screen.getByText('cherry')).toBeInTheDocument();
    expect(screen.queryByText('No words found. Try different criteria!')).not.toBeInTheDocument();
  });

  it('displays a message when no words are found', () => {
    render(<WordResults results={[]} resultCount={0} onSortChange={() => {}} />);

    expect(screen.getByText('No words found. Try different criteria!')).toBeInTheDocument();
    expect(screen.queryByText('apple')).not.toBeInTheDocument();
  });

  
});
