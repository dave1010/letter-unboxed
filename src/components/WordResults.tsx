import React from 'react'

interface WordResultsProps {
  results: string[]
  resultCount: number
  onSortChange: (
    sortOrder: 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc'
  ) => void
}

const WordResults: React.FC<WordResultsProps> = ({ results, resultCount, onSortChange }) => {
  return (
    <div className="border-t border-gray-200 pt-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-center text-xl font-bold text-gray-700">
          Results ({resultCount})
        </h2>
        <select
          aria-label="Sort results"
          onChange={(e) =>
            onSortChange(
              e.target.value as 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc'
            )
          }
          className="rounded border p-1 text-sm"
        >
          <option value="alphabetical-asc">Alphabetical (A-Z)</option>
          <option value="alphabetical-desc">Alphabetical (Z-A)</option>
          <option value="length-asc">Length (shortest first)</option>
          <option value="length-desc">Length (longest first)</option>
        </select>
      </div>
      {results.length === 0 && (
        <p className="text-center text-gray-600">No words found for the selected letters.</p>
      )}
      <ul className="grid max-h-96 list-none gap-2 overflow-y-auto rounded border p-2 md:grid-cols-3">
        {results.map((word) => (
          <li
            key={word}
            className="rounded border bg-white p-2 text-center shadow-sm"
          >
            {word}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default WordResults
