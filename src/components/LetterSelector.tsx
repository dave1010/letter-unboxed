import React from 'react';

type LetterStatus = 'available' | 'required-start' | 'required-anywhere' | 'required-end' | 'excluded';

interface LetterSelectorProps {
  letterStatuses: Record<string, LetterStatus>;
  onLetterClick: (char: string) => void;
}

const LetterSelector: React.FC<LetterSelectorProps> = ({ letterStatuses, onLetterClick }) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  const getStatusStyles = (status: LetterStatus): { main: string; legend: string; name: string } => {
    switch (status) {
      case 'available':
        return { main: 'bg-secondary hover:bg-opacity-80 text-background-end border-2 border-secondary', legend: 'bg-secondary text-background-end', name: 'Available' };
      case 'required-start':
        return { main: 'bg-primary hover:bg-opacity-80 text-text-primary border-2 border-primary border-l-4 border-accent', legend: 'bg-primary text-text-primary border-l-4 border-accent', name: 'Starts with' };
      case 'required-anywhere':
        return { main: 'bg-primary hover:bg-opacity-80 text-text-primary border-2 border-primary border-b-4 border-accent', legend: 'bg-primary text-text-primary border-b-4 border-accent', name: 'Contains' };
      case 'required-end':
        return { main: 'bg-primary hover:bg-opacity-80 text-text-primary border-2 border-primary border-r-4 border-accent', legend: 'bg-primary text-text-primary border-r-4 border-accent', name: 'Ends with' };
      case 'excluded':
      default:
        return { main: 'bg-background-start hover:bg-opacity-60 text-text-secondary border-2 border-gray-600', legend: 'bg-background-start text-text-secondary', name: 'Excluded' };
    }
  };

  const legendItems: { status: LetterStatus; name: string }[] = [
    { status: 'available', name: 'Available' },
    { status: 'required-start', name: 'Starts with' },
    { status: 'required-anywhere', name: 'Contains' },
    { status: 'required-end', name: 'Ends with' },
    { status: 'excluded', name: 'Excluded' },
  ];

  return (
    <div className="text-center">
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        {legendItems.map(({ status, name }) => (
          <span
            key={name}
            className={`px-3 py-1.5 text-xs font-bold rounded-md shadow ${getStatusStyles(status).legend} transition-all`}
          >
            {name}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-2 items-center justify-center">
        {alphabet.map((char) => {
          const status = letterStatuses[char];
          const styles = getStatusStyles(status);
          return (
            <button
              key={char}
              onClick={() => onLetterClick(char)}
              className={`w-12 h-12 text-lg font-bold rounded-lg shadow-md focus:outline-none focus:ring-2 ring-offset-2 ring-offset-background-start ${styles.main} transition-all duration-200 ease-in-out transform hover:scale-110`}
              title={`${char.toUpperCase()}: ${styles.name}`}
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
