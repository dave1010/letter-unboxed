import { describe, it, expect } from 'vitest';
import { Dictionary } from '../lib/dictionary';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Dictionary Performance', () => {
  it('should filter a large word list efficiently', () => {
    const scowlPath = join(__dirname, '../../src/dictionary/scowl_35.txt');
    const wordList = readFileSync(scowlPath, 'utf-8').split('\n').filter(Boolean);
    const dictionary = new Dictionary(wordList);

    const availableLetters = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz'; // All letters, repeated to allow for words with multiple instances of the same letter

    const startTime = performance.now();
    const filteredWords = dictionary.filterWords(availableLetters);
    const endTime = performance.now();

    const duration = endTime - startTime;
    console.log(`Filtering ${wordList.length} words took ${duration.toFixed(2)} ms`);

    // Expect the duration to be within an acceptable range (e.g., < 100ms for a reasonable dictionary size)
    // This threshold might need adjustment based on the actual performance and expected dictionary size.
        expect(duration).toBeLessThan(500);

    // Basic sanity check: ensure some words are filtered (if availableLetters is restrictive) or all words are included (if availableLetters is permissive)
    expect(filteredWords.length).toBeGreaterThan(0);
  });
});
