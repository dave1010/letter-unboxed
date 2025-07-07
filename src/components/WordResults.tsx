import React from 'react';

export type SortOrder =
  | 'alphabetical-asc'
  | 'alphabetical-desc'
  | 'length-asc'
  | 'length-desc';

interface WordResultsProps {
  results: string[];
}

const WordResults: React.FC<WordResultsProps> = ({
  results,
}) => {
  return (
    <div className="border-t border-gray-600 pt-5">
      <div className="mb-4" />
      {results.length === 0 && (
        <p className="text-center text-gray-400">
          No words found for the selected letters.
        </p>
      )}
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
    </div>
  );
};

export default WordResults;
