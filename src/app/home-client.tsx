"use client";

import { useState, useEffect } from 'react';
import { Dictionary } from '../lib/dictionary';

interface HomeProps {
  wordList: string[];
}

export default function Home({ wordList }: HomeProps) {
  const [allowedLetters, setAllowedLetters] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  useEffect(() => {
    if (wordList) {
      setDictionary(new Dictionary(...wordList));
    }
  }, [wordList]);

  useEffect(() => {
    if (dictionary && allowedLetters) {
      const filteredWords = dictionary.filterAvailable(allowedLetters);
      setResults(filteredWords);
    } else {
      setResults([]);
    }
  }, [allowedLetters, dictionary]);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Letter Unboxed</h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <label htmlFor="allowedLetters" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Allowed Letters:
        </label>
        <input
          type="text"
          id="allowedLetters"
          value={allowedLetters}
          onChange={(e) => setAllowedLetters(e.target.value.toLowerCase())}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '100%',
            maxWidth: '300px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
          }}
          placeholder="e.g., abcdefg"
        />
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <h2 style={{ color: '#555', textAlign: 'center', marginBottom: '15px' }}>Results</h2>
        {results.length === 0 && allowedLetters.length > 0 && (
          <p style={{ textAlign: 'center', color: '#777' }}>No words found for the given letters.</p>
        )}
        {allowedLetters.length === 0 && (
          <p style={{ textAlign: 'center', color: '#777' }}>Enter allowed letters to see results.</p>
        )}
        <ul style={{
          listStyle: 'none',
          padding: '0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: '10px',
        }}>
          {results.map((word) => (
            <li key={word} style={{
              background: '#f9f9f9',
              border: '1px solid #eee',
              borderRadius: '5px',
              padding: '8px',
              textAlign: 'center',
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            }}>
              {word}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}