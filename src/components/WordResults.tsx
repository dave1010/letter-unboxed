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
    <div className="w-full mt-10 p-6 bg-white bg-opacity-5 rounded-lg shadow-xl border-t border-accent">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-semibold text-primary">
          Results ({resultCount > 1000 ? "1000+" : resultCount})
        </h2>
        <div className="relative flex items-center space-x-2">
          <label htmlFor="sortOrder" className="text-lg text-text-secondary">Sort:</label>
          <select
            id="sortOrder"
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              onSortChange(e.target.value as
                | 'alphabetical-asc'
                | 'alphabetical-desc'
                | 'length-asc'
                | 'length-desc')
            }
            className="appearance-none bg-background-start border border-accent text-text-primary py-2.5 px-4 pr-10 rounded-md leading-tight focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
          >
            <option value="alphabetical-asc" className="bg-background-end text-text-primary">A-Z</option>
            <option value="alphabetical-desc" className="bg-background-end text-text-primary">Z-A</option>
            <option value="length-asc" className="bg-background-end text-text-primary">Shortest</option>
            <option value="length-desc" className="bg-background-end text-text-primary">Longest</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-secondary">
            <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
      </div>
      {results.length === 0 && (
        <p className="text-center text-text-secondary py-4 text-lg">
          No words found for the selected letters.
        </p>
      )}
      <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3 max-h-[400px] overflow-y-auto bg-background-start bg-opacity-50 p-4 rounded-md border border-accent shadow-inner">
        {results.map((word) => (
          <li
            key={word}
            className="bg-background-end border border-accent rounded-lg p-2.5 text-center shadow-md text-text-primary hover:bg-accent hover:text-background-start transition-all duration-200 ease-in-out transform hover:scale-105"
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordResults;
