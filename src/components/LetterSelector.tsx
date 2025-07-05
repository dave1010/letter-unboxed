import React from 'react';

type LetterStatus = 'available' | 'required-start' | 'required-anywhere' | 'required-end' | 'excluded';

interface LetterSelectorProps {
  letterStatuses: Record<string, LetterStatus>;
  onLetterClick: (char: string) => void;
}

const LetterSelector: React.FC<LetterSelectorProps> = ({ letterStatuses, onLetterClick }) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
      <h2 style={{ color: '#555', marginBottom: '10px' }}>Select Available Letters</h2>
      <p style={{ marginBottom: '15px', fontSize: '0.9em', color: '#666' }}>
        Click letters to cycle through: Available (blue) &rarr; Required at Start (light green, left border) &rarr; Required anywhere (green, bottom border) &rarr; Required at End (light green, right border) &rarr; Excluded (red)
      </p>
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
          backgroundColor: '#bfd5c4',
          color: '#155724',
          marginRight: '5px',
          borderLeft: '4px solid #155724'
        }}>Required at Start</span>
        <span style={{
          padding: '5px 10px',
          fontSize: '12px',
          fontWeight: 'bold',
          borderRadius: '5px',
          border: '1px solid #ccc',
          backgroundColor: '#d4edda',
          color: '#155724',
          marginRight: '5px',
          borderBottom: '4px solid #155724'
        }}>Required anywhere</span>
        <span style={{
          padding: '5px 10px',
          fontSize: '12px',
          fontWeight: 'bold',
          borderRadius: '5px',
          border: '1px solid #ccc',
          backgroundColor: '#e2f3e8',
          color: '#155724',
          marginRight: '5px',
          borderRight: '4px solid #155724'
        }}>Required at End</span>
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
        {alphabet.map((char) => {
          const status = letterStatuses[char];
          let style: React.CSSProperties = {
            padding: '10px 15px',
            fontSize: '18px',
            fontWeight: 'bold',
            borderRadius: '5px',
            cursor: 'pointer',
            minWidth: '50px',
            border: '1px solid #ccc'
          };
          if (status === 'available') {
            style.backgroundColor = '#cfe2ff';
            style.color = '#055160';
          } else if (status === 'required-start') {
            style.backgroundColor = '#bfd5c4';
            style.color = '#155724';
            style.borderLeft = '4px solid #155724';
          } else if (status === 'required-anywhere') {
            style.backgroundColor = '#d4edda';
            style.color = '#155724';
            style.borderBottom = '4px solid #155724';
          } else if (status === 'required-end') {
            style.backgroundColor = '#e2f3e8';
            style.color = '#155724';
            style.borderRight = '4px solid #155724';
          } else { // excluded
            style.backgroundColor = '#f8d7da';
            style.color = '#721c24';
          }
          return (
          <button
            key={char}
            onClick={() => onLetterClick(char)}
            style={style}
          >
            {char.toUpperCase()}
          </button>
          );
        })}
      </div>
    </div>
  );
};

export default LetterSelector;
