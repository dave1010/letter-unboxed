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
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-300 bg-blue-200 text-blue-700">
          Available
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-300 bg-green-200 text-green-700 border-l-4 border-green-700">
          Required at Start
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-300 bg-green-200 text-green-700 border-b-4 border-green-700">
          Required anywhere
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-300 bg-green-200 text-green-700 border-r-4 border-green-700">
          Required at End
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-gray-300 bg-rose-200 text-rose-700">
          Excluded
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {alphabet.map((char) => {
          const status = letterStatuses[char];
          const base = 'px-4 py-2 text-lg font-bold rounded transition border';
          const statusClasses =
            status === 'available'
              ? 'bg-blue-200 text-blue-700 border-blue-400'
              : status === 'required-start'
              ? 'bg-green-200 text-green-700 border-green-400 border-l-4'
              : status === 'required-anywhere'
              ? 'bg-green-200 text-green-700 border-green-400 border-b-4'
              : status === 'required-end'
              ? 'bg-green-200 text-green-700 border-green-400 border-r-4'
              : 'bg-rose-200 text-rose-700 border-rose-400';
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
