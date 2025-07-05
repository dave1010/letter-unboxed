import React from 'react';

type LetterStatus = 'available' | 'required' | 'unavailable';

interface LetterSelectorProps {
  letterStatuses: Record<string, LetterStatus>;
  onLetterClick: (char: string) => void;
}

const LetterSelector: React.FC<LetterSelectorProps> = ({ letterStatuses, onLetterClick }) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#555', marginBottom: '10px' }}>Select Available Letters</h2>
      <p style={{ marginBottom: '15px', fontSize: '0.9em', color: '#666' }}>Click letters to cycle through: Available (blue) &rarr; Required (green) &rarr; Excluded (red)</p>
      <div style={{ marginBottom: '10px' }}>
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
        }}>Excluded</span>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '5px' }}>
        {alphabet.map((char) => (
          <button
            key={char}
            onClick={() => onLetterClick(char)}
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
  );
};

export default LetterSelector;
