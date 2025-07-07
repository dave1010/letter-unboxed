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
  const noLettersMessage =
    "Tap letters to make them available. Tap again to require words to use them at the start, anywhere in the word or at the end.";
  const noWordsMessage = "No words found for the selected letters.";
  return (
    <div className="border-t border-gray-600 pt-5 h-full flex flex-col">
      {results.length === 0 ? (
        <div className="flex-grow flex items-center justify-center">
          <p className="text-center text-gray-400 px-4">
            {lettersSelected ? noWordsMessage : noLettersMessage}
          </p>
        </div>
      ) : (
        <ul className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 overflow-y-auto border border-gray-600 p-2 rounded-md bg-gray-800/50">
          {results.map((word) => (
            <li
              key={word}
              className="bg-gray-700 border border-gray-600 rounded-md p-2 text-center shadow-sm text-white"
            >
              {word}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WordResults;
