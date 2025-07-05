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

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#333', textAlign: 'center' }}>Letter Unboxed</h1>
      <LetterSelector letterStatuses={letterStatuses} onLetterClick={handleLetterClick} />
      <WordResults results={results} />
    </div>
  );
}