import { describe, it, expect } from 'vitest';
import { Dictionary } from '../lib/dictionary';

describe('Dictionary', () => {
  it('should correctly identify if a word exists in the dictionary', () => {
    const dictionary = new Dictionary('apple', 'banana', 'apricot', 'bandana', 'orange');
    expect(dictionary.hasWord('apple')).toBe(true);
    expect(dictionary.hasWord('grape')).toBe(false);
    expect(dictionary.hasWord('Apple')).toBe(true); // Case insensitivity
  });

  it('should filter words based on available letters (filterAvailable)', () => {
    const dictionary = new Dictionary('cat', 'dog', 'cot', 'act', 'tac', 'car', 'foo');
    expect(dictionary.filterAvailable('cat')).toEqual(expect.arrayContaining(['cat', 'act', 'tac']));
    expect(dictionary.filterAvailable('CAT')).toEqual(expect.arrayContaining(['cat', 'act', 'tac'])); // Case insensitivity
    expect(dictionary.filterAvailable('fo')).toEqual(expect.arrayContaining(['foo']));
    expect(dictionary.filterAvailable('xyz')).toEqual([]);
  });

  it('should filter words based on unavailable letters (filterUnavailable)', () => {
    const dictionary = new Dictionary('apple', 'banana', 'apricot', 'bandana', 'orange');
    expect(dictionary.filterUnavailable('p')).toEqual(expect.arrayContaining(['banana', 'bandana', 'orange']));
    expect(dictionary.filterUnavailable('P')).toEqual(expect.arrayContaining(['banana', 'bandana', 'orange'])); // Case insensitivity
    expect(dictionary.filterUnavailable('xyz')).toEqual(expect.arrayContaining(['apple', 'banana', 'apricot', 'bandana', 'orange']));
    expect(dictionary.filterUnavailable('a')).toEqual([]);
  });

  it('should filter words based on available and required letters (filterAvailableRequire)', () => {
    const dictionary = new Dictionary('apple', 'banana', 'apricot', 'bandana', 'orange', 'grape');
    expect(dictionary.filterAvailableRequire('apricot', 'a')).toEqual(expect.arrayContaining(['apricot']));
    expect(dictionary.filterAvailableRequire('apricot', 'A')).toEqual(expect.arrayContaining(['apricot'])); // Case insensitivity
    expect(dictionary.filterAvailableRequire('abfor', 'ab')).toEqual([]);
    expect(dictionary.filterAvailableRequire('apple', 'z')).toEqual([]);
    expect(dictionary.filterAvailableRequire('apple', 'p')).toEqual(expect.arrayContaining(['apple']));
  });

  it('should handle empty dictionary', () => {
    const dictionary = new Dictionary();
    expect(dictionary.hasWord('anyword')).toBe(false);
    expect(dictionary.filterAvailable('abc')).toEqual([]);
    expect(dictionary.filterUnavailable('abc')).toEqual([]);
    expect(dictionary.filterAvailableRequire('abc', 'a')).toEqual([]);
  });

  it('should handle words with repeated letters', () => {
    const dictionary = new Dictionary('book', 'look', 'cool');
    expect(dictionary.filterAvailable('bok')).toEqual(expect.arrayContaining(['book']));
    expect(dictionary.filterAvailable('lok')).toEqual(expect.arrayContaining(['look']));
    expect(dictionary.filterAvailable('col')).toEqual(expect.arrayContaining(['cool']));
  });

  it('should correctly filter words with repeated letters based on available letters', () => {
    const dictionary = new Dictionary('banana', 'bandana', 'apple', 'bookkeeper');
    expect(dictionary.filterAvailable('banaa')).toEqual(expect.arrayContaining(['banana']));
    expect(dictionary.filterAvailable('banada')).toEqual(expect.arrayContaining(['bandana']));
    expect(dictionary.filterAvailable('aple')).toEqual(expect.arrayContaining(['apple']));
    expect(dictionary.filterAvailable('bokepr')).toEqual(expect.arrayContaining(['bookkeeper']));
    expect(dictionary.filterAvailable('bokeeper')).toEqual(expect.arrayContaining(['bookkeeper']));
  });
});