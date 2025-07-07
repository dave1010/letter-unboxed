import React from 'react';

export type SortOrder =
  | 'alphabetical-asc'
  | 'alphabetical-desc'
  | 'length-asc'
  | 'length-desc';

interface WordResultsProps {
  results: string[];
  lettersSelected: boolean;
}

const WordResults: React.FC<WordResultsProps> = ({ results, lettersSelected }) => {
  const noLettersMessagePart1 =
    "Tap letters to make them available.";
  const noLettersMessagePart2 =
    "Tap again to require words to use them at the start, anywhere in the word or at the end.";
  const noWordsMessage = "No words found for the selected letters.";
  return (
    <div className="h-full flex flex-col">
      {results.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          {lettersSelected ? (
            <p className="text-center text-gray-400 px-4">{noWordsMessage}</p>
          ) : (
            <div className="text-center text-gray-400 px-4 space-y-2">
              <p>{noLettersMessagePart1}</p>
              <p>{noLettersMessagePart2}</p>
            </div>
          )}
        </div>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 overflow-y-auto p-2 rounded-md bg-gray-800/50">
          {results.map((word) => {
            const longWord = word.length >= 15;
            return (
              <li
                key={word}
                className={`bg-gray-700 border border-gray-600 rounded-md p-2 text-center shadow-sm text-white${longWord ? ' text-sm' : ''}`}
              >
                {word}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default WordResults;
