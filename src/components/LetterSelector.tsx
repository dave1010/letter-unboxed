import React from 'react'

type LetterStatus = 'available' | 'required' | 'unavailable'

interface LetterSelectorProps {
  letterStatuses: Record<string, LetterStatus>
  onLetterClick: (char: string) => void
}

const LetterSelector: React.FC<LetterSelectorProps> = ({ letterStatuses, onLetterClick }) => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')
  const statusClasses: Record<LetterStatus, string> = {
    available: 'bg-blue-200 text-blue-800',
    required: 'bg-green-200 text-green-800',
    unavailable: 'bg-red-200 text-red-800',
  }

  return (
    <div className="mb-6 text-center">
      <div className="mb-2 flex justify-center gap-2 text-sm font-bold">
        <span className="rounded border bg-blue-200 px-2 text-blue-800">Available</span>
        <span className="rounded border bg-green-200 px-2 text-green-800">Required</span>
        <span className="rounded border bg-red-200 px-2 text-red-800">Excluded</span>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {alphabet.map((char) => (
          <button
            key={char}
            onClick={() => onLetterClick(char)}
            className={`min-w-[50px] rounded border px-4 py-2 text-lg font-bold ${statusClasses[letterStatuses[char]]}`}
          >
            {char.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}

export default LetterSelector
