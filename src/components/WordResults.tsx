import React from 'react';

interface WordResultsProps {
  results: string[];
  resultCount: number;
  onSortChange: (sortOrder: 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc') => void;
}

const WordResults: React.FC<WordResultsProps> = ({ results, resultCount, onSortChange }) => {
  return (
    <div className="border-t border-slate-200 pt-6 mt-8">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-3xl font-semibold text-emerald-700">Results <span className="text-xl text-slate-500">({resultCount})</span></h2>
        <div className="flex items-center">
          <label htmlFor="sortOrder" className="mr-2 text-slate-700 font-medium">Sort by:</label>
          <select
            id="sortOrder"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onSortChange(e.target.value as 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc')}
            className="p-2 rounded-md border border-slate-300 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm text-slate-700 bg-white"
          >
            <option value="alphabetical-asc">Alphabetical (A-Z)</option>
            <option value="alphabetical-desc">Alphabetical (Z-A)</option>
            <option value="length-asc">Length (shortest)</option>
            <option value="length-desc">Length (longest)</option>
          </select>
        </div>
      </div>
      {results.length === 0 && (
        <p className="text-center text-slate-500 py-10">No words found. Try different criteria!</p>
      )}
      <ul className="list-none grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-h-96 overflow-y-auto border border-slate-200 p-4 rounded-lg bg-slate-50 shadow-inner">
        {results.map((word) => (
          <li key={word} className="bg-emerald-500 hover:bg-emerald-600 text-white font-medium rounded-lg p-3 text-center shadow-md transition-all hover:scale-105 cursor-default">
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordResults;
