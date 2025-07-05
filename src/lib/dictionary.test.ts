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

  it('should filter words based on available, required, and unavailable letters (filter)', () => {
    const dictionary = new Dictionary('apple', 'banana', 'apricot', 'bandana', 'orange', 'grape', 'apply');
    // Available: a,p,l,e, Required: a, Unavailable: b
    expect(dictionary.filter('apley', 'a', 'b')).toEqual(expect.arrayContaining(['apple', 'apply']));
    // Available: a,p,l,e, Required: p, Unavailable: b
    expect(dictionary.filter('aple', 'p', 'b')).toEqual(expect.arrayContaining(['apple']));
    // Available: a,p,l,e, Required: a,p, Unavailable: b
    expect(dictionary.filter('aple', 'ap', 'b')).toEqual(expect.arrayContaining(['apple']));
    // Available: a,p,l,e, Required: z, Unavailable: b
    expect(dictionary.filter('aple', 'z', 'b')).toEqual([]);
    // Available: a,p,l,e, Required: a, Unavailable: p
    expect(dictionary.filter('aple', 'a', 'p')).toEqual([]);
    // Available: b,a,n, Required: b, Unavailable: p
    expect(dictionary.filter('ban', 'b', 'p')).toEqual(expect.arrayContaining(['banana']));
    // Available: b,a,n,d, Required: b, Unavailable: p
    expect(dictionary.filter('band', 'b', 'p')).toEqual(expect.arrayContaining(['bandana']));
    // Available: o,r,a,n,g,e, Required: o, Unavailable: p
    expect(dictionary.filter('orange', 'o', 'p')).toEqual(expect.arrayContaining(['orange']));
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

  it('should filter words with startsWith and endsWith parameters', () => {
    const allLetters = 'abcdefghijklmnopqrstuvwxyz';
    const dictionary = new Dictionary('apple', 'banana', 'angle', 'ample', 'ape');
    expect(dictionary.filter(allLetters, '', '', 'a', 'e')).toEqual(expect.arrayContaining(['apple', 'angle', 'ample', 'ape']));
    expect(dictionary.filter(allLetters, '', '', 'AP', 'LE')).toEqual(expect.arrayContaining(['apple']));
  });

  it('should filter words based on letterGroups restrictions', () => {
    const dictionary = new Dictionary('ada', 'aba', 'aca', 'bcb', 'bcc', 'dad');
    expect(dictionary.filter('abcd', '', '', '', '', 'ab')).toEqual(expect.arrayContaining(['ada', 'aca', 'bcb', 'bcc', 'dad']));
    expect(dictionary.filter('ABCD', '', '', '', '', 'AB')).toEqual(expect.arrayContaining(['ada', 'aca', 'bcb', 'bcc', 'dad']));
  });

  it('should handle case insensitivity across available, required, and unavailable letters in filter', () => {
    const dictionary = new Dictionary('apple', 'banana', 'cherry');
    expect(dictionary.filter('APPLEBANACHERRY', 'A', 'C')).toEqual(expect.arrayContaining(['apple', 'banana']));
    expect(dictionary.filter('appleBANACHERRY', 'a', 'c')).toEqual(expect.arrayContaining(['apple', 'banana']));
  });
});