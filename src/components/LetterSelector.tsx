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
        <span className="px-3 py-1 text-xs font-bold rounded border border-cyan-400 bg-cyan-700 text-white">
          Available
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-lime-400 bg-lime-700 text-white border-l-4">
          Required at Start
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-lime-400 bg-lime-600 text-white border-b-4">
          Required anywhere
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-lime-400 bg-lime-700 text-white border-r-4">
          Required at End
        </span>
        <span className="px-3 py-1 text-xs font-bold rounded border border-rose-400 bg-rose-700 text-white">
          Excluded
        </span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {alphabet.map((char) => {
          const status = letterStatuses[char];
          const base = 'px-4 py-2 text-lg font-bold rounded transition border';
          const statusClasses =
            status === 'available'
              ? 'bg-cyan-700 text-cyan-100 border-cyan-400'
              : status === 'required-start'
              ? 'bg-lime-700 text-lime-100 border-lime-400 border-l-4'
              : status === 'required-anywhere'
              ? 'bg-lime-600 text-lime-100 border-lime-400 border-b-4'
              : status === 'required-end'
              ? 'bg-lime-700 text-lime-100 border-lime-400 border-r-4'
              : 'bg-rose-700 text-rose-100 border-rose-400';
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
