import React from 'react';
import { LetterStatus, getLetterButtonClasses } from './letterStyles';

interface LetterGroupsDisplayProps {
  letterStatuses: Record<string, LetterStatus>;
  onShowLetters: () => void;
}

const LetterGroupsDisplay: React.FC<LetterGroupsDisplayProps> = ({ letterStatuses, onShowLetters }) => {
  const letters = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] !== 'excluded')
    .sort();

  return (
    <div className="mb-6 text-center space-y-2 w-full max-w-lg mx-auto">
      <div className="grid grid-cols-10 gap-1 w-full">
        {letters.map((char) => (
          <div key={char} className="p-1 border-2 border-gray-500 rounded">
            <button
              aria-label={char.toUpperCase()}
              className={getLetterButtonClasses(letterStatuses[char], false)}
              disabled
            >
              {char.toUpperCase()}
            </button>
          </div>
        ))}
        <button
          onClick={onShowLetters}
          className="py-2 text-lg font-bold rounded transition border-2 shadow-md hover:scale-105 bg-gray-600 text-gray-300 border-gray-700 col-span-2"
        >
          Letters
        </button>
      </div>
    </div>
  );
};

export default LetterGroupsDisplay;
