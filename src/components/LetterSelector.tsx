import React from 'react';
import { LetterStatus, getLetterButtonClasses } from './letterStyles';

interface LetterSelectorProps {
  letterStatuses: Record<string, LetterStatus>;
  onLetterClick: (char: string) => void;
  onShowGroups?: () => void;
}

        const LetterSelector: React.FC<LetterSelectorProps> = ({ letterStatuses, onLetterClick, onShowGroups }) => {
          const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

  return (
    <div className="mb-6 text-center">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <span className="px-3 py-1 text-xs font-bold rounded border-2 border-blue-700 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          Available
        </span>
        <span className="px-3 pl-1 py-1 text-xs font-bold rounded border-2 border-white bg-gradient-to-br from-green-600 to-green-800 text-white">
          Start
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border-2 border-white bg-gradient-to-br from-green-600 to-green-800 text-white">
          Must contain
        </span>
        <span className="px-3 pr-1 py-1 text-xs font-bold rounded border-2 border-white bg-gradient-to-br from-green-600 to-green-800 text-white">
          End
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border-2 border-gray-700 bg-gray-600 text-gray-300">
          Excluded
        </span>
      </div>
              <div className="space-y-2 w-full max-w-lg mx-auto">
                {rows.map((row, rowIndex) => (
                  <div key={row} className="grid grid-cols-10 gap-1 w-full">
                    {row.split('').map((char) => {
                      const status = letterStatuses[char];
                      return (
                        <button
                          key={char}
                          onClick={() => onLetterClick(char)}
                          className={getLetterButtonClasses(status)}
                        >
                          {char.toUpperCase()}
                        </button>
                      );
                    })}
                    {rowIndex === rows.length - 1 && onShowGroups && (
                      <button
                        onClick={onShowGroups}
                        className={`py-2 text-lg font-bold rounded transition border-2 shadow-md hover:scale-105 bg-gray-600 text-gray-300 border-gray-700 col-span-2`}
                      >
                        Groups
                      </button>
                    )}
                  </div>
                ))}
              </div>
    </div>
  );
};

export default LetterSelector;
