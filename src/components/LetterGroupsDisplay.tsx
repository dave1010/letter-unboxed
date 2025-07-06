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
    <div className="mb-6 text-center flex flex-wrap justify-center gap-2">
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
        className="py-2 px-4 text-sm font-bold rounded border-2 border-gray-700 bg-gray-600 text-gray-300"
      >
        Letters
      </button>
    </div>
  );
};

export default LetterGroupsDisplay;
