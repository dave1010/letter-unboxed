import React from 'react';

type LetterStatus = 'available' | 'required-start' | 'required-anywhere' | 'required-end' | 'excluded';

interface LetterSelectorProps {
  letterStatuses: Record<string, LetterStatus>;
  onLetterClick: (char: string) => void;
}

const LetterSelector: React.FC<LetterSelectorProps> = ({ letterStatuses, onLetterClick }) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

  return (
    <div className="mb-6 text-center">
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-700 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
          Available
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-700 bg-gradient-to-br from-green-500 to-green-700 text-white border-l-4 border-green-300">
          Required at Start
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-700 bg-gradient-to-br from-green-500 to-green-700 text-white border-b-4 border-green-300">
          Required anywhere
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-700 bg-gradient-to-br from-green-500 to-green-700 text-white border-r-4 border-green-300">
          Required at End
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-700 bg-gradient-to-br from-rose-500 to-rose-700 text-white">
          Excluded
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {alphabet.map((char) => {
          const status = letterStatuses[char];
          const base = 'px-4 py-2 text-lg font-bold rounded transition border shadow-md hover:scale-105';
          const statusClasses =
            status === 'available'
              ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-700'
              : status === 'required-start'
              ? 'bg-gradient-to-br from-green-500 to-green-700 text-white border-green-700 border-l-4'
              : status === 'required-anywhere'
              ? 'bg-gradient-to-br from-green-500 to-green-700 text-white border-green-700 border-b-4'
              : status === 'required-end'
              ? 'bg-gradient-to-br from-green-500 to-green-700 text-white border-green-700 border-r-4'
              : 'bg-gradient-to-br from-rose-500 to-rose-700 text-white border-rose-700';
          return (
            <button
              key={char}
              onClick={() => onLetterClick(char)}
              className={`${base} ${statusClasses}`}
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
