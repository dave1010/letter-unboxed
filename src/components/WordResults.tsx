import React from 'react';

interface WordResultsProps {
  results: string[];
}

const WordResults: React.FC<WordResultsProps> = ({ results }) => {
  return (
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
  );
};

export default WordResults;
