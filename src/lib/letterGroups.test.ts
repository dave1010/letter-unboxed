import { describe, it, expect } from 'vitest';
import { moveLetter } from './letterGroups';

describe('moveLetter', () => {
  it('moves a letter to another group', () => {
    const result = moveLetter(['a', 'b', 'c'], 'a', 0, 1);
    expect(result).toEqual(['ba', 'c']);
  });

  it('creates new group when dropped outside', () => {
    const result = moveLetter(['a', 'b', 'c'], 'a', 0, null);
    expect(result).toEqual(['b', 'c', 'a']);
  });

  it('removes empty groups', () => {
    const result = moveLetter(['ab', 'c'], 'a', 0, 1);
    expect(result).toEqual(['b', 'ca']);
  });
});
