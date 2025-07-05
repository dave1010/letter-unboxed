/**
 * Represents a dictionary of words, providing functionalities to check for word existence
 * and filter words based on available letters.
 */
export class Dictionary {
  private words: Set<string>;
  private wordLetterCounts: Map<string, Map<string, number>>;

  /**
   * Creates an instance of Dictionary.
   * @param wordList An array of words to initialize the dictionary.
   */
  constructor(wordList: string[]) {
    this.words = new Set(wordList);
    this.wordLetterCounts = new Map();
    for (const word of wordList) {
      this.wordLetterCounts.set(word, this.getLetterCounts(word));
    }
  }

  /**
   * Checks if a given word exists in the dictionary.
   * @param word The word to check.
   * @returns True if the word exists, false otherwise.
   */
  public hasWord(word: string): boolean {
    return this.words.has(word);
  }

  /**
   * Counts the occurrences of each letter in a given text.
   * @param text The input string.
   * @returns A Map where keys are characters and values are their counts.
   */
  private getLetterCounts(text: string): Map<string, number> {
    const counts = new Map<string, number>();
    for (const char of text) {
      counts.set(char, (counts.get(char) || 0) + 1);
    }
    return counts;
  }

  /**
   * Filters the dictionary words to find those that can be formed using only the available letters.
   * A word can be formed if all its letters are present in the available letters with sufficient counts.
   * @param availableLetters A string containing the letters that are available.
   * @returns An array of words from the dictionary that can be formed with the available letters.
   */
  public filterWords(availableLetters: string): string[] {
    const availableLetterCounts = this.getLetterCounts(availableLetters);
    
    const filtered: string[] = [];

    for (const word of this.words) {
      const wordLetterCounts = this.wordLetterCounts.get(word);
      if (!wordLetterCounts) {
        continue; // Should not happen if wordLetterCounts is populated correctly
      }

      let isValid = true;
      for (const [char, count] of wordLetterCounts) {
        if ((availableLetterCounts.get(char) || 0) < count) {
          isValid = false;
          break;
        }
      }
      if (isValid) {
        filtered.push(word);
      }
    }
    return filtered;
  }
}
