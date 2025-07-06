import { describe, it, expect } from 'vitest';
import { moveLetter, getInsertionIndex } from './letterGroups';

describe('moveLetter', () => {
  it('moves a letter to another group', () => {
    const result = moveLetter(['a', 'b', 'c'], 'a', 0, 1);
    expect(result).toEqual(['ab', 'c']);
  });

  it('creates new group when dropped outside', () => {
    const result = moveLetter(['a', 'b', 'c'], 'a', 0, null);
    expect(result).toEqual(['b', 'c', 'a']);
  });

  it('removes empty groups', () => {
    const result = moveLetter(['ab', 'c'], 'a', 0, 1);
    expect(result).toEqual(['b', 'ac']);
  });
});

it('calculates insertion index alphabetically', () => {
  expect(getInsertionIndex('ac', 'b')).toBe(1);
  expect(getInsertionIndex('ac', 'd')).toBe(2);
  expect(getInsertionIndex('bd', 'a')).toBe(0);
});
