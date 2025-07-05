"use client";

import { useState, useEffect } from 'react';
import { Dictionary } from '../lib/dictionary';
import LetterSelector from '../components/LetterSelector';
import WordResults from '../components/WordResults';

interface HomeProps {
  wordList: string[];
}

type LetterStatus = 'available' | 'required' | 'unavailable';

export default function Home({ wordList }: HomeProps) {
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>(() => {
    const initialStatuses: Record<string, LetterStatus> = {};
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(char => {
      initialStatuses[char] = 'unavailable';
    });
    return initialStatuses;
  });
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
      const availableLetters = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'available'
      ).join('');
      const requiredLetters = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'required'
      ).join('');
      const unavailableLetters = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'unavailable'
      ).join('');

      const filteredWords = dictionary.filter(availableLetters, requiredLetters, unavailableLetters, startsWith, endsWith, letterGroups);

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
  }, [letterStatuses, dictionary, sortOrder, startsWith, endsWith, letterGroups]);

  const handleLetterClick = (char: string) => {
    setLetterStatuses((prevStatuses) => {
      const currentStatus = prevStatuses[char];
      let newStatus: LetterStatus;
      if (currentStatus === 'unavailable') {
        newStatus = 'available';
      } else if (currentStatus === 'available') {
        newStatus = 'required';
      } else if (currentStatus === 'required') {
        newStatus = 'unavailable';
      } else {
        newStatus = 'unavailable'; // Default to unavailable if not set
      }
      return { ...prevStatuses, [char]: newStatus };
    });
  };

  const handleSortChange = (sortOrder: 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc') => {
    setSortOrder(sortOrder);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center', fontSize: '2.5em', marginBottom: '20px', textShadow: '2px 2px 4px rgba(0,0,0,0.1)' }}>Letter Unboxed</h1>
      <button onClick={() => setShowHelp(!showHelp)} style={{ display: 'block', margin: '0 auto 20px auto', padding: '10px 20px', fontSize: '1em', cursor: 'pointer', borderRadius: '5px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
        {showHelp ? 'Hide Help' : 'Show Help'}
      </button>
      {showHelp && (
        <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '20px', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}>
          <h2 style={{ textAlign: 'center', color: '#555', marginBottom: '15px' }}>How to Use</h2>
          <p>This tool helps you solve Letter Boxed puzzles. Here&apos;s how:</p>
          <ul style={{ listStyle: 'disc', marginLeft: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>Select Letters:</strong> Click on the letters below to cycle through their states:</li>
            <ul style={{ listStyle: 'circle', marginLeft: '20px', marginBottom: '10px' }}>
              <li><span style={{ fontWeight: 'bold', color: '#055160' }}>Available (Blue):</span> The letter can be used in words.</li>
              <li><span style={{ fontWeight: 'bold', color: '#155724' }}>Required (Green):</span> The letter *must* be used in every word.</li>
              <li><span style={{ fontWeight: 'bold', color: '#721c24' }}>Excluded (Red):</span> The letter *cannot* be used in words.</li>
            </ul>
            <li style={{ marginBottom: '10px' }}><strong>View Results:</strong> As you select letters, matching words will appear below.</li>
            <li style={{ marginBottom: '10px' }}><strong>Sort Results:</strong> Use the dropdown to sort the results alphabetically or by length.</li>
            <li><strong>Limit Results:</strong> Only the first 1000 results are shown for performance.</li>
          </ul>
        </div>
      )}
      <LetterSelector letterStatuses={letterStatuses} onLetterClick={handleLetterClick} />
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="startsWith" style={{ marginRight: '5px' }}>Starts with:</label>
        <input
          type="text"
          id="startsWith"
          value={startsWith}
          onChange={(e) => setStartsWith(e.target.value.toLowerCase())}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '80px', marginRight: '15px' }}
          maxLength={1}
        />
        <label htmlFor="endsWith" style={{ marginRight: '5px' }}>Ends with:</label>
        <input
          type="text"
          id="endsWith"
          value={endsWith}
          onChange={(e) => setEndsWith(e.target.value.toLowerCase())}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '80px' }}
          maxLength={1}
        />
      </div>
      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="letterGroups" style={{ marginRight: '5px' }}>Letter Groups (e.g., abc,def):</label>
        <input
          type="text"
          id="letterGroups"
          value={letterGroups}
          onChange={(e) => setLetterGroups(e.target.value.toLowerCase())}
          style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc', width: '200px' }}
        />
      </div>
      <WordResults results={results} resultCount={results.length} onSortChange={handleSortChange} />
    </div>
  );
}