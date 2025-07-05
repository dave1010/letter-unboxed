import { describe, it, expect } from 'vitest';
import { Dictionary } from '../lib/dictionary';

describe('Dictionary', () => {
  it('should correctly identify if a word exists in the dictionary', () => {
    const wordList = ['apple', 'banana', 'apricot', 'bandana', 'orange'];
    const dictionary = new Dictionary(wordList);
    expect(dictionary.hasWord('apple')).toBe(true);
    expect(dictionary.hasWord('grape')).toBe(false);
  });

  it('should filter words based on available letters', () => {
    const wordList = ['cat', 'dog', 'cot', 'act', 'tac', 'car'];
    const dictionary = new Dictionary(wordList);
    const filteredWords = dictionary.filterWords('cat');
    expect(filteredWords).toEqual(expect.arrayContaining(['cat', 'act', 'tac']));
    expect(filteredWords).not.toEqual(expect.arrayContaining(['dog', 'cot', 'car']));
    expect(filteredWords.length).toBe(3);
  });

  it('should handle words with repeated letters', () => {
    const wordList = ['book', 'look', 'cool'];
    const dictionary = new Dictionary(wordList);
    const filteredWords = dictionary.filterWords('boko');
    expect(filteredWords).toEqual(expect.arrayContaining(['book']));
    expect(filteredWords).not.toEqual(expect.arrayContaining(['look', 'cool']));
    expect(filteredWords.length).toBe(1);
  });

  it('should return an empty array when filtering with no available letters', () => {
    const wordList = ['cat', 'dog', 'cot'];
    const dictionary = new Dictionary(wordList);
    const filteredWords = dictionary.filterWords('');
    expect(filteredWords).toEqual([]);
  });

  it('should correctly initialize with an empty word list', () => {
    const dictionary = new Dictionary([]);
    expect(dictionary.hasWord('anyword')).toBe(false);
    expect(dictionary.filterWords('abc')).toEqual([]);
  });
});
