"use client";

import { useState, useEffect } from 'react';
import { Dictionary } from '../lib/dictionary';
import LetterSelector from '../components/LetterSelector';
import WordResults, { SortOrder } from '../components/WordResults';
import LetterGroupsDisplay from '../components/LetterGroupsDisplay';
import type { LetterStatus } from '../components/letterStyles';
import { encodeState, decodeState } from '../lib/urlState';

interface HomeProps {
  wordList: string[];
}

export default function Home({ wordList }: HomeProps) {
  const defaultStatuses = () => {
    const statuses: Record<string, LetterStatus> = {};
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(char => {
      statuses[char] = 'excluded';
    });
    return statuses;
  };

  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>(() => defaultStatuses());
  const [results, setResults] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [letterGroups, setLetterGroups] = useState<string>('');
  const [showLetterGroups, setShowLetterGroups] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('length-desc');
  const [initialised, setInitialised] = useState(false);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  useEffect(() => {
    if (wordList) {
      setDictionary(new Dictionary(...wordList));
    }
  }, [wordList]);

  useEffect(() => {
    const state = decodeState(window.location.hash);
    setLetterStatuses(state.letterStatuses);
    setLetterGroups(state.letterGroups);
    setSortOrder(state.sortOrder);
    setInitialised(true);
  }, []);

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

  useEffect(() => {
    if (!initialised) return;
    const hash = encodeState(letterStatuses, letterGroups, sortOrder);
    window.history.replaceState(null, '', hash ? `#${hash}` : '#');
  }, [letterStatuses, letterGroups, sortOrder, initialised]);

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

  const handleSortChange = (sortOrder: SortOrder) => {
    setSortOrder(sortOrder);
  };

  const handleShowGroups = () => {
    const selected = Object.keys(letterStatuses)
      .filter(
        (char) =>
          letterStatuses[char] === 'available' ||
          letterStatuses[char].startsWith('required')
      )
      .sort();

    const selectedSet = new Set(selected);
    let groups = letterGroups ? letterGroups.split(',').filter(Boolean) : [];

    if (!letterGroups) {
      groups = selected.map(ch => ch);
    } else {
      groups = groups
        .map(g => g.split('').filter(ch => selectedSet.has(ch)).join(''))
        .filter(g => g);

      const grouped = new Set(groups.join(''));
      selected.forEach(ch => {
        if (!grouped.has(ch)) groups.push(ch);
      });
    }

    setLetterGroups(groups.join(','));
    setShowLetterGroups(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Letter Unboxed
        </h1>
        <button
          aria-label={showHelp ? 'Close help' : 'Open help'}
          onClick={() => setShowHelp(!showHelp)}
          className="text-white bg-blue-600 hover:bg-blue-700 h-10 w-10 flex items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          ?
        </button>
      </header>
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg mx-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">About</h2>
              <button
                aria-label="Close help"
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Explore potential Letter Boxed words, find anagrams and learn words that start or end with specific letters.
              </p>
              <p>Tap letters to cycle through modes:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 text-xs font-bold rounded border-2 border-blue-700 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                  Available
                </span>
                <span className="px-3 pl-1 py-1 text-xs font-bold rounded border-2 border-white bg-gradient-to-br from-green-600 to-green-800 text-white">
                  Start
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded border-2 border-white bg-gradient-to-br from-green-600 to-green-800 text-white">
                  Must contain
                </span>
                <span className="px-3 pr-1 py-1 text-xs font-bold rounded border-2 border-white bg-gradient-to-br from-green-600 to-green-800 text-white">
                  End
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded border-2 border-gray-700 bg-gray-600 text-gray-300">
                  Excluded
                </span>
              </div>
              <p>
                Drag letters into groups to stop them being used consecutively.
              </p>
              <p>
                <a
                  href="https://dave.engineer"
                  className="underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Made by Dave
                </a>
                {' · '}
                <a
                  href="https://github.com/dave1010/letter-unboxed"
                  className="underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View code on GitHub
                </a>
              </p>
              <p>
                <a
                  href="http://wordlist.aspell.net/"
                  className="underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Word list from SCOWL
                </a>
              </p>
              <p>
                <a
                  href="https://www.nytimes.com/puzzles/letter-boxed"
                  className="underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Not affiliated with NYT Letter Boxed
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
      {!showLetterGroups && (
        <LetterSelector
          letterStatuses={letterStatuses}
          onLetterClick={handleLetterClick}
          onShowGroups={handleShowGroups}
        />
      )}
      {showLetterGroups && (
        <LetterGroupsDisplay
          letterStatuses={letterStatuses}
          letterGroups={letterGroups}
          onGroupsChange={setLetterGroups}
          onShowLetters={() => setShowLetterGroups(false)}
        />
      )}
      <WordResults
        results={results}
        resultCount={results.length}
        onSortChange={handleSortChange}
        sortOrder={sortOrder}
      />
    </div>
  );
}