import React from 'react';

interface WordResultsProps {
  results: string[];
  resultCount?: number;
  onSortChange?: (sortOrder: 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc') => void;
}

const WordResults: React.FC<WordResultsProps> = ({
  results,
  resultCount = results.length,
  onSortChange = () => {},
}) => {
  return (
    <div className="border-t border-gray-700 pt-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-100">Results ({resultCount})</h2>
        <div className="flex items-center space-x-2">
          <label htmlFor="sortOrder" className="text-sm text-gray-300">Sort:</label>
          <select
            id="sortOrder"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onSortChange(e.target.value as
                | 'alphabetical-asc'
                | 'alphabetical-desc'
                | 'length-asc'
                | 'length-desc')
            }
            className="px-2 py-1 border border-gray-600 rounded-md bg-gray-800 text-sm text-gray-100"
          >
            <option value="alphabetical-asc">A-Z</option>
            <option value="alphabetical-desc">Z-A</option>
            <option value="length-asc">Shortest</option>
            <option value="length-desc">Longest</option>
          </select>
        </div>
      </div>
      {results.length === 0 && (
        <p className="text-center text-gray-600">
          No words found for the selected letters.
        </p>
      )}
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-2 max-h-96 overflow-y-auto border border-gray-700 p-2 rounded-md">
        {results.map((word) => (
          <li
            key={word}
            className="bg-gray-800 border border-gray-700 rounded-md p-2 text-center shadow-sm text-gray-100"
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordResults;
