"use client";

import { useState, useEffect } from 'react';
import { Dictionary } from '../lib/dictionary';
import LetterSelector from '../components/LetterSelector';
import WordResults from '../components/WordResults';

interface HomeProps {
  wordList: string[];
}

type LetterStatus = 'available' | 'required-start' | 'required-anywhere' | 'required-end' | 'excluded';

export default function Home({ wordList }: HomeProps) {
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>(() => {
    const initialStatuses: Record<string, LetterStatus> = {};
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(char => {
      initialStatuses[char] = 'excluded';
    });
    return initialStatuses;
  });
  const [results, setResults] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [letterGroups, setLetterGroups] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc'>('alphabetical-asc');
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  useEffect(() => {
    if (wordList) {
      setDictionary(new Dictionary(...wordList));
    }
  }, [wordList]);

  useEffect(() => {
    if (dictionary) {
      const availableLetters = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'available'
      ).join('');
      const requiredAnywhere = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'required-anywhere'
      ).join('');
      const requiredStart = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'required-start'
      ).join('');
      const requiredEnd = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'required-end'
      ).join('');
      const excludedLetters = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'excluded'
      ).join('');

      const filteredWords = dictionary.filter(
        availableLetters,
        requiredAnywhere + requiredStart + requiredEnd,
        excludedLetters,
        requiredStart,
        requiredEnd,
        letterGroups
      );

      const sortedWords = [...filteredWords];
      switch (sortOrder) {
        case 'alphabetical-asc':
          sortedWords.sort();
          break;
        case 'alphabetical-desc':
          sortedWords.sort().reverse();
          break;
        case 'length-asc':
          sortedWords.sort((a, b) => a.length - b.length || a.localeCompare(b));
          break;
        case 'length-desc':
          sortedWords.sort((a, b) => b.length - a.length || a.localeCompare(b));
          break;
      }
      setResults(sortedWords.slice(0, 1000));
    } else {
      setResults([]);
    }
  }, [letterStatuses, dictionary, sortOrder, letterGroups]);

  const handleLetterClick = (char: string) => {
    setLetterStatuses((prev) => {
      const current = prev[char];
      let next: LetterStatus;
      if (current === 'excluded') {
        next = 'available';
      } else if (current === 'available') {
        next = 'required-start';
      } else if (current === 'required-start') {
        next = 'required-anywhere';
      } else if (current === 'required-anywhere') {
        next = 'required-end';
      } else if (current === 'required-end') {
        next = 'excluded';
      } else {
        next = 'excluded';
      }
      return { ...prev, [char]: next };
    });
  };

  const handleSortChange = (sortOrder: 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc') => {
    setSortOrder(sortOrder);
  };

  return (
    <div className="max-w-3xl mx-auto p-4 bg-black/50 rounded-lg shadow-lg backdrop-blur-md">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Letter Unboxed
        </h1>
        <button
          aria-label={showHelp ? 'Close help' : 'Open help'}
          onClick={() => setShowHelp(!showHelp)}
          className="text-white bg-pink-600 hover:bg-pink-700 p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
        >
          ?
        </button>
      </header>
      {showHelp && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-800 text-gray-100 rounded-lg p-6 max-w-lg mx-4 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">How to Use</h2>
              <button
                aria-label="Close help"
                onClick={() => setShowHelp(false)}
                className="text-gray-300 hover:text-white focus:outline-none"
              >
                &times;
              </button>
            </div>
            <div className="space-y-2 text-gray-200">
              <p>This tool helps you solve Letter Boxed puzzles. Here&apos;s how:</p>
              <ul className="list-disc list-inside">
                <li>
                  <strong>Select Letters:</strong> Click on the letters below to cycle through their states.
                </li>
                <li>
                  <strong>View Results:</strong> Matching words appear below in real time.
                </li>
                <li>
                  <strong>Sort Results:</strong> Use the sort menu to order results alphabetically or by length.
                </li>
                <li>
                  <strong>Letter Groups:</strong> Define groups with comma-separated letters (e.g., <code>abc,def</code>).
                </li>
                <li>
                  <strong>Performance:</strong> Only the first 1000 results are shown for speed.
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
      <LetterSelector letterStatuses={letterStatuses} onLetterClick={handleLetterClick} />
      <div className="mb-6 text-center">
        <label htmlFor="letterGroups" className="mr-2 text-sm font-medium text-gray-200">
          Letter Groups (e.g., abc,def):
        </label>
        <input
          type="text"
          id="letterGroups"
          value={letterGroups}
          onChange={(e) => setLetterGroups(e.target.value.toLowerCase())}
          className="px-2 py-1 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <WordResults
        results={results}
        resultCount={results.length}
        onSortChange={handleSortChange}
      />
    </div>
  );
}