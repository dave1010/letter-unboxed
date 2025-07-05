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
    <div className="max-w-4xl mx-auto p-6 bg-white bg-opacity-5 shadow-2xl rounded-lg mt-10">
      <header className="flex items-center justify-between mb-8">
        <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          Letter Unboxed
        </h1>
        <button
          aria-label={showHelp ? 'Close help' : 'Open help'}
          onClick={() => setShowHelp(!showHelp)}
          className="text-text-primary bg-accent hover:bg-opacity-80 p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-secondary ring-offset-2 ring-offset-background-end transition-all duration-300 ease-in-out transform hover:scale-110"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
          </svg>
        </button>
      </header>
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-background-end rounded-xl p-8 max-w-lg mx-auto shadow-2xl border border-accent">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-semibold text-primary">How to Use</h2>
              <button
                aria-label="Close help"
                onClick={() => setShowHelp(false)}
                className="text-text-secondary hover:text-primary focus:outline-none text-4xl"
              >
                &times;
              </button>
            </div>
            <div className="space-y-3 text-text-secondary">
              <p>This tool helps you solve Letter Boxed puzzles. Here&apos;s how:</p>
              <ul className="list-disc list-inside space-y-1 pl-2">
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
      <div className="mb-8 p-6 bg-white bg-opacity-5 rounded-lg shadow-xl">
        <LetterSelector letterStatuses={letterStatuses} onLetterClick={handleLetterClick} />
      </div>
      <div className="mb-8 p-6 bg-white bg-opacity-5 rounded-lg shadow-xl text-center">
        <label htmlFor="letterGroups" className="mr-3 text-lg font-medium text-text-secondary">
          Letter Groups (e.g., abc,def):
        </label>
        <input
          type="text"
          id="letterGroups"
          value={letterGroups}
          onChange={(e) => setLetterGroups(e.target.value.toLowerCase())}
          className="px-3 py-2 bg-background-start border border-accent rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-text-primary placeholder-text-secondary transition-colors"
          placeholder="Enter letter groups..."
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