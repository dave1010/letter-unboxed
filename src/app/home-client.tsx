"use client";

import { useState, useEffect } from 'react';
import { Dictionary } from '../lib/dictionary';

interface HomeProps {
  wordList: string[];
}

export default function Home({ wordList }: HomeProps) {
  type LetterStatus = 'available' | 'required' | 'unavailable';
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>(() => {
    const initialStatuses: Record<string, LetterStatus> = {};
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach(char => {
      initialStatuses[char] = 'unavailable';
    });
    return initialStatuses;
  });
  const [results, setResults] = useState<string[]>([]);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  useEffect(() => {
    if (wordList) {
      setDictionary(new Dictionary(...wordList));
    }
  }, [wordList]);

  useEffect(() => {
    if (dictionary) {
      const availableLetters = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'available' || letterStatuses[char] === 'required'
      ).join('');
      const requiredLetters = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'required'
      ).join('');
      const unavailableLetters = Object.keys(letterStatuses).filter(
        (char) => letterStatuses[char] === 'unavailable'
      ).join('');

      const filteredWords = dictionary.filter(availableLetters, requiredLetters, unavailableLetters);
      setResults(filteredWords);
    } else {
      setResults([]);
    }
  }, [letterStatuses, dictionary]);

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

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Letter Unboxed</h1>

      <div style={{ marginBottom: '20px', textAlign: 'center' }}>
        <p style={{ marginBottom: '10px' }}>Key 
          <span style={{
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#cfe2ff',
            color: '#055160',
            marginRight: '5px',
            marginLeft: '5px'
          }}>Available</span> 
          <span style={{
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#d4edda',
            color: '#155724',
            marginRight: '5px'
          }}>Required</span> 
          <span style={{
            padding: '5px 10px',
            fontSize: '12px',
            fontWeight: 'bold',
            borderRadius: '5px',
            border: '1px solid #ccc',
            backgroundColor: '#f8d7da',
            color: '#721c24',
          }}>Excluded</span></p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
          {alphabet.map((char) => (
            <button
              key={char}
              onClick={() => handleLetterClick(char)}
              style={{
                padding: '10px 15px',
                fontSize: '18px',
                fontWeight: 'bold',
                borderRadius: '5px',
                border: '1px solid #ccc',
                cursor: 'pointer',
                minWidth: '50px',
                backgroundColor:
                  letterStatuses[char] === 'required'
                    ? '#d4edda' // Light green for required
                    : letterStatuses[char] === 'unavailable'
                    ? '#f8d7da' // Light red for unavailable
                    : '#cfe2ff', // Light blue for available
                color:
                  letterStatuses[char] === 'required'
                    ? '#155724'
                    : letterStatuses[char] === 'unavailable'
                    ? '#721c24'
                    : '#055160', // Dark blue for available
              }}
            >
              {char.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
        <h2 style={{ color: '#555', textAlign: 'center', marginBottom: '15px' }}>Results</h2>
        {results.length === 0 && (
          <p style={{ textAlign: 'center', color: '#777' }}>No words found for the selected letters.</p>
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
