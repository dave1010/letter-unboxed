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
        <span className="px-3 py-1 text-xs font-bold rounded border border-blue-500 bg-blue-700 text-white">
          Available
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-green-500 bg-green-700 text-white border-l-4">
          Required at Start
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-green-500 bg-green-700 text-white border-b-4">
          Required anywhere
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-green-500 bg-green-700 text-white border-r-4">
          Required at End
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-rose-500 bg-rose-700 text-white">
          Excluded
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {alphabet.map((char) => {
          const status = letterStatuses[char];
          const base = 'px-4 py-2 text-lg font-bold rounded transition border transform hover:scale-105';
          const statusClasses =
            status === 'available'
              ? 'bg-blue-700 text-white border-blue-500 hover:bg-blue-600'
              : status === 'required-start'
              ? 'bg-green-700 text-white border-green-500 border-l-4 hover:bg-green-600'
              : status === 'required-anywhere'
              ? 'bg-green-700 text-white border-green-500 border-b-4 hover:bg-green-600'
              : status === 'required-end'
              ? 'bg-green-700 text-white border-green-500 border-r-4 hover:bg-green-600'
              : 'bg-rose-700 text-white border-rose-500 hover:bg-rose-600';
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
