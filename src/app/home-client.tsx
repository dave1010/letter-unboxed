"use client";

import { useState, useEffect } from 'react';
import { Dictionary } from '../lib/dictionary';
import WordResults from '../components/WordResults';

interface HomeProps {
  wordList: string[];
}

export default function Home({ wordList }: HomeProps) {
  const [results, setResults] = useState<string[]>([]);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [startsWith, setStartsWith] = useState<string>('');
  const [endsWith, setEndsWith] = useState<string>('');
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
      // TODO: Update filter logic if 'availableLetters', 'requiredLetters', 'unavailableLetters' were used beyond LetterSelector
      const filteredWords = dictionary.filter('', '', '', startsWith, endsWith, letterGroups);

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
  }, [dictionary, sortOrder, startsWith, endsWith, letterGroups]);

  const handleSortChange = (sortOrder: 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc') => {
    setSortOrder(sortOrder);
  };

  return (
    <div className="font-sans p-5 max-w-3xl mx-auto">
      <div className="relative">
        <h1 className="text-emerald-600 text-center text-5xl font-bold mb-10 tracking-tight" style={{ textShadow: '3px 3px 6px rgba(0,128,0,0.2)' }}>Letter Unboxed</h1>
        <button
          onClick={() => setShowHelp(true)}
          className="absolute top-0 right-0 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-full w-8 h-8 flex items-center justify-center text-xl shadow-md transition-all hover:shadow-lg"
          aria-label="Show help"
        >
          ?
        </button>
      </div>

      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gradient-to-br from-teal-400 to-emerald-600 p-6 rounded-xl shadow-2xl max-w-lg w-full text-white transform transition-all scale-100 opacity-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold tracking-tight">How to Use</h2>
              <button
                onClick={() => setShowHelp(false)}
                className="text-white hover:text-teal-100 text-3xl font-bold"
                aria-label="Close help"
              >
                &times;
              </button>
            </div>
            <p className="mb-4 text-teal-50">This tool helps you find words based on various criteria. Here&apos;s how:</p>
            <ul className="list-disc list-inside space-y-2 text-teal-100">
              <li><strong>Filter by Starting/Ending Letters:</strong> Enter a letter in the &apos;Starts with&apos; or &apos;Ends with&apos; fields.</li>
              <li><strong>Filter by Letter Groups:</strong> Enter groups of letters that must appear in the word (e.g., "th", "ing"). Separate multiple groups with commas.</li>
              <li><strong>View Results:</strong> Matching words will appear below.</li>
              <li><strong>Sort Results:</strong> Use the controls to sort the results alphabetically or by length.</li>
              <li><strong>Limit Results:</strong> Only the first 1000 results are shown for performance.</li>
            </ul>
          </div>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col items-center">
            <label htmlFor="startsWith" className="mb-1 text-slate-700 font-medium self-start">Starts with:</label>
            <input
              type="text"
              id="startsWith"
              value={startsWith}
              onChange={(e) => setStartsWith(e.target.value.toLowerCase())}
              className="p-2 rounded-md border border-slate-300 w-full focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              maxLength={1}
            />
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor="endsWith" className="mb-1 text-slate-700 font-medium self-start">Ends with:</label>
            <input
              type="text"
              id="endsWith"
              value={endsWith}
              onChange={(e) => setEndsWith(e.target.value.toLowerCase())}
              className="p-2 rounded-md border border-slate-300 w-full focus:ring-emerald-500 focus:border-emerald-500 shadow-sm"
              maxLength={1}
            />
          </div>
        </div>
        <div className="text-center">
          <label htmlFor="letterGroups" className="mb-1 text-slate-700 font-medium block text-left">Letter Groups (e.g., abc,def):</label>
          <input
            type="text"
            id="letterGroups"
            value={letterGroups}
            onChange={(e) => setLetterGroups(e.target.value.toLowerCase())}
            className="p-2 rounded-md border border-slate-300 w-full md:w-3/4 lg:w-1/2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm mx-auto"
          />
        </div>
      </div>
      <WordResults results={results} resultCount={results.length} onSortChange={handleSortChange} />
    </div>
  );
}