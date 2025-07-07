import React from 'react';
import { LetterStatus, getLetterButtonClasses } from './letterStyles';

interface LetterSelectorProps {
  letterStatuses: Record<string, LetterStatus>;
  onLetterClick: (char: string) => void;
  onShowGroups?: () => void;
  onToggleAll?: () => void;
  toggleAllNext?: boolean;
}

const LetterSelector: React.FC<LetterSelectorProps> = ({
  letterStatuses,
  onLetterClick,
  onShowGroups,
  onToggleAll,
  toggleAllNext,
}) => {
  const rows = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm'];

  return (
    <div className="mb-6 text-center">
              <div className="space-y-2 w-full max-w-lg mx-auto">
                {rows.map((row, rowIndex) => (
                  <div
                    key={row}
                    className={`grid grid-cols-10 gap-1 w-full ${rowIndex === 1 ? 'ml-[5%]' : ''}`}
                  >
                    {rowIndex === rows.length - 1 && onToggleAll && (
                      <button
                        aria-label={toggleAllNext ? 'Enable all letters' : 'Clear all letters'}
                        onClick={onToggleAll}
                        className={getLetterButtonClasses('excluded')}
                      >
                        {toggleAllNext ? '🔤' : '🧹'}
                      </button>
                    )}
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
