/**
 * Represents a dictionary of words, providing functionalities to check for word existence
 * and filter words based on available letters.
 */
export class Dictionary {
  private words: Set<string>;

  /**
   * Creates an instance of Dictionary.
   * @param wordList A variable number of words to initialize the dictionary.
   */
  constructor(...wordList: string[]) {
    this.words = new Set(wordList.map(word => word.toLowerCase()));
  }

  /**
   * Checks if a given word exists in the dictionary.
   * @param word The word to check.
   * @returns True if the word exists, false otherwise.
   */
  public hasWord(word: string): boolean {
    return this.words.has(word.toLowerCase());
  }

  /**
   * Filters words to find those that can be formed using only the available letters.
   * @param availableLetters A string containing the letters that are available.
   * @returns An array of words from the dictionary that meet the criteria.
   */
  public filterAvailable(availableLetters: string): string[] {
    const availableLettersSet = new Set(availableLetters.toLowerCase());
    const filtered: string[] = [];

    for (const word of this.words) {
      let isValid = true;
      for (const char of word) {
        if (!availableLettersSet.has(char)) {
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

  /**
   * Filters words to find those that do NOT contain any of the unavailable letters.
   * @param unavailableLetters A string containing the letters that are unavailable.
   * @returns An array of words from the dictionary that meet the criteria.
   */
  public filterUnavailable(unavailableLetters: string): string[] {
    const unavailableLettersSet = new Set(unavailableLetters.toLowerCase());
    const filtered: string[] = [];

    for (const word of this.words) {
      let isValid = true;
      for (const char of word) {
        if (unavailableLettersSet.has(char)) {
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

  /**
   * Filters words to find those that can be formed using only the available letters
   * and must include all of the required letters.
   * @param availableLetters A string containing the letters that are available.
   * @param requiredLetters A string containing the letters that must be present in the word.
   * @returns An array of words from the dictionary that meet the criteria.
   */
  public filterAvailableRequire(availableLetters: string, requiredLetters: string): string[] {
    const availableLettersSet = new Set(availableLetters.toLowerCase());
    const requiredLettersSet = new Set(requiredLetters.toLowerCase());
    const filtered: string[] = [];

    for (const word of this.words) {
      let isValid = true;

      // Check if word uses only availableLetters
      for (const char of word) {
        if (!availableLettersSet.has(char)) {
          isValid = false;
          break;
        }
      }
      if (!isValid) continue;

      // Check for requiredLetters
      for (const char of requiredLettersSet) {
        if (!word.includes(char)) {
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

  /**
   * Filters words based on available, required, and unavailable letters.
   * @param availableLetters A string containing the letters that are available.
   * @param requiredLetters A string containing the letters that must be present in the word.
   * @param unavailableLetters A string containing the letters that cannot be present in the word.
   * @returns An array of words from the dictionary that meet all criteria.
   */
  public filter(availableLetters: string, requiredLetters: string, unavailableLetters: string, startsWith: string = '', endsWith: string = '', letterGroups: string = ''): string[] {
    const availableLettersSet = new Set(availableLetters.toLowerCase());
    const requiredLettersSet = new Set(requiredLetters.toLowerCase());
    const unavailableLettersSet = new Set(unavailableLetters.toLowerCase());
    const filtered: string[] = [];

    for (const word of this.words) {
      let isValid = true;

      // Check for unavailable letters
      for (const char of word) {
        if (unavailableLettersSet.has(char)) {
          isValid = false;
          break;
        }
      }
      if (!isValid) continue;

      // Create a set of all letters that are allowed (available or required)
      const allowedLettersSet = new Set([...availableLettersSet, ...requiredLettersSet]);

      // Check if word uses only allowed letters (available or required)
      for (const char of word) {
        if (!allowedLettersSet.has(char)) {
          isValid = false;
          break;
        }
      }
      if (!isValid) continue;

      // Check for requiredLetters
      for (const char of requiredLettersSet) {
        if (!word.includes(char)) {
          isValid = false;
          break;
        }
      }
      // Check for startsWith and endsWith
      if (startsWith && !word.startsWith(startsWith)) {
        isValid = false;
      }
      if (isValid && endsWith && !word.endsWith(endsWith)) {
        isValid = false;
      }
      if (!isValid) continue;

      // Check for letter group restrictions
      if (letterGroups) {
        const groups = letterGroups.split(',').map(group => new Set(group.toLowerCase().split('')));
        for (let i = 0; i < word.length - 1; i++) {
          const char1 = word[i];
          const char2 = word[i + 1];
          for (const group of groups) {
            if (group.has(char1) && group.has(char2)) {
              isValid = false;
              break;
            }
          }
          if (!isValid) break;
        }
      }
      if (!isValid) continue;

      if (isValid) {
        filtered.push(word);
      }
    }
    return filtered;
  }
}
