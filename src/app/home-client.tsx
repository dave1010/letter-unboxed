"use client"

import { useState, useEffect } from 'react'
import { Dictionary } from '../lib/dictionary'
import LetterSelector from '../components/LetterSelector'
import WordResults from '../components/WordResults'
import HelpOverlay from '../components/HelpOverlay'

interface HomeProps {
  wordList: string[]
}

type LetterStatus = 'available' | 'required' | 'unavailable'

export default function Home({ wordList }: HomeProps) {
  const [letterStatuses, setLetterStatuses] = useState<Record<string, LetterStatus>>(() => {
    const initialStatuses: Record<string, LetterStatus> = {}
    'abcdefghijklmnopqrstuvwxyz'.split('').forEach((char) => {
      initialStatuses[char] = 'unavailable'
    })
    return initialStatuses
  })
  const [results, setResults] = useState<string[]>([])
  const [showHelp, setShowHelp] = useState<boolean>(false)
  const [startsWith, setStartsWith] = useState<string>('')
  const [endsWith, setEndsWith] = useState<string>('')
  const [letterGroups, setLetterGroups] = useState<string>('')
  const [sortOrder, setSortOrder] = useState<
    'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc'
  >('alphabetical-asc')
  const [dictionary, setDictionary] = useState<Dictionary | null>(null)

  useEffect(() => {
    if (wordList) {
      setDictionary(new Dictionary(...wordList))
    }
  }, [wordList])

  useEffect(() => {
    if (dictionary) {
      const availableLetters = Object.keys(letterStatuses)
        .filter((char) => letterStatuses[char] === 'available')
        .join('')
      const requiredLetters = Object.keys(letterStatuses)
        .filter((char) => letterStatuses[char] === 'required')
        .join('')
      const unavailableLetters = Object.keys(letterStatuses)
        .filter((char) => letterStatuses[char] === 'unavailable')
        .join('')

      const filteredWords = dictionary.filter(
        availableLetters,
        requiredLetters,
        unavailableLetters,
        startsWith,
        endsWith,
        letterGroups
      )

      const sortedWords = [...filteredWords]
      switch (sortOrder) {
        case 'alphabetical-asc':
          sortedWords.sort()
          break
        case 'alphabetical-desc':
          sortedWords.sort().reverse()
          break
        case 'length-asc':
          sortedWords.sort((a, b) => a.length - b.length || a.localeCompare(b))
          break
        case 'length-desc':
          sortedWords.sort((a, b) => b.length - a.length || a.localeCompare(b))
          break
      }
      setResults(sortedWords.slice(0, 1000))
    } else {
      setResults([])
    }
  }, [letterStatuses, dictionary, sortOrder, startsWith, endsWith, letterGroups])

  const handleLetterClick = (char: string) => {
    setLetterStatuses((prevStatuses) => {
      const currentStatus = prevStatuses[char]
      let newStatus: LetterStatus
      if (currentStatus === 'unavailable') {
        newStatus = 'available'
      } else if (currentStatus === 'available') {
        newStatus = 'required'
      } else if (currentStatus === 'required') {
        newStatus = 'unavailable'
      } else {
        newStatus = 'unavailable'
      }
      return { ...prevStatuses, [char]: newStatus }
    })
  }

  const handleSortChange = (
    sortOrder: 'alphabetical-asc' | 'alphabetical-desc' | 'length-asc' | 'length-desc'
  ) => {
    setSortOrder(sortOrder)
  }

  return (
    <div className="mx-auto max-w-3xl p-5 font-sans">
      <div className="relative mb-6 text-center">
        <h1 className="text-5xl font-extrabold text-gray-800 drop-shadow-md">Letter Unboxed</h1>
        <button
          aria-label="Show help"
          onClick={() => setShowHelp(true)}
          className="absolute right-0 top-0 text-2xl font-bold text-blue-700 hover:text-blue-900"
        >
          ?
        </button>
      </div>
      {showHelp && <HelpOverlay onClose={() => setShowHelp(false)} />}
      <LetterSelector letterStatuses={letterStatuses} onLetterClick={handleLetterClick} />
      <div className="mb-4 text-center">
        <label htmlFor="startsWith" className="mr-2">Starts with:</label>
        <input
          type="text"
          id="startsWith"
          value={startsWith}
          onChange={(e) => setStartsWith(e.target.value.toLowerCase())}
          className="mr-4 rounded border p-2 w-20"
          maxLength={1}
        />
        <label htmlFor="endsWith" className="mr-2">Ends with:</label>
        <input
          type="text"
          id="endsWith"
          value={endsWith}
          onChange={(e) => setEndsWith(e.target.value.toLowerCase())}
          className="rounded border p-2 w-20"
          maxLength={1}
        />
      </div>
      <div className="mb-4 text-center">
        <label htmlFor="letterGroups" className="mr-2">Letter Groups (e.g., abc,def):</label>
        <input
          type="text"
          id="letterGroups"
          value={letterGroups}
          onChange={(e) => setLetterGroups(e.target.value.toLowerCase())}
          className="w-48 rounded border p-2"
        />
      </div>
      <WordResults results={results} resultCount={results.length} onSortChange={handleSortChange} />
    </div>
  )
}
