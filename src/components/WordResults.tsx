import React from 'react';

interface WordResultsProps {
  results: string[];
  resultCount: number;
  onSortChange: (sortOrder: 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc') => void;
}

const WordResults: React.FC<WordResultsProps> = ({ results, resultCount, onSortChange }) => {
  return (
    <div style={{ borderTop: '1px solid #eee', paddingTop: '20px' }}>
      <h2 style={{ color: '#555', textAlign: 'center', marginBottom: '15px' }}>Results ({resultCount})</h2>
      <div style={{ textAlign: 'center', marginBottom: '15px' }}>
        <label htmlFor="sortOrder">Sort by: </label>
        <select id="sortOrder" onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value as 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc')} style={{ padding: '5px', borderRadius: '5px', border: '1px solid #ccc' }}>
          <option value="alphabetical-asc">Alphabetical (A-Z)</option>
          <option value="alphabetical-desc">Alphabetical (Z-A)</option>
          <option value="length-asc">Length (shortest first)</option>
          <option value="length-desc">Length (longest first)</option>
        </select>
      </div>
      {results.length === 0 && (
        <p style={{ textAlign: 'center', color: '#777' }}>No words found for the selected letters.</p>
      )}
      <ul style={{
        listStyle: 'none',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
        gap: '10px',
        maxHeight: '400px', // Fixed height
        overflowY: 'auto', // Enable vertical scrolling
        border: '1px solid #eee',
        padding: '10px',
        borderRadius: '5px',
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
  );
};

export default WordResults;
