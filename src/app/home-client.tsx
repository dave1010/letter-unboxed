"use client";

import { useState, useEffect } from "react";
import { Dictionary } from "../lib/dictionary";
import LetterSelector from "../components/LetterSelector";
import WordResults, { SortOrder } from "../components/WordResults";
import LetterGroupsDisplay from "../components/LetterGroupsDisplay";
import type { LetterStatus } from "../components/letterStyles";
import { getLetterButtonClasses } from "../components/letterStyles";
import { encodeState, decodeState } from "../lib/urlState";
import {
  computeResults,
  createDefaultStatuses,
  cycleMap,
  calculateGroups,
} from "./home-utils";

interface HomeProps {
  wordList: string[];
}

export default function Home({ wordList }: HomeProps) {
  const [letterStatuses, setLetterStatuses] = useState<
    Record<string, LetterStatus>
  >(() => createDefaultStatuses());
  const [results, setResults] = useState<string[]>([]);
  const [enableAllNext, setEnableAllNext] = useState(true);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [letterGroups, setLetterGroups] = useState<string>("");
  const [showLetterGroups, setShowLetterGroups] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("length-desc");
  const [initialised, setInitialised] = useState(false);
  const [dictionary, setDictionary] = useState<Dictionary | null>(null);

  useEffect(() => {
    if (wordList) {
      setDictionary(new Dictionary(...wordList));
    }
  }, [wordList]);

  useEffect(() => {
    const state = decodeState(window.location.hash);
    setLetterStatuses(state.letterStatuses);
    setLetterGroups(state.letterGroups);
    setSortOrder(state.sortOrder);
    setInitialised(true);
  }, []);

  useEffect(() => {
    setResults(
      computeResults(dictionary, letterStatuses, sortOrder, letterGroups),
    );
  }, [letterStatuses, dictionary, sortOrder, letterGroups]);

  useEffect(() => {
    if (!initialised) return;
    const hash = encodeState(letterStatuses, letterGroups, sortOrder);
    window.history.replaceState(null, "", hash ? `#${hash}` : "#");
  }, [letterStatuses, letterGroups, sortOrder, initialised]);

  const handleLetterClick = (char: string) => {
    setLetterStatuses((prev) => ({ ...prev, [char]: cycleMap[prev[char]] }));
  };

  const handleToggleAll = () => {
    setLetterStatuses((prev) => {
      const updated: Record<string, LetterStatus> = {};
      Object.keys(prev).forEach((c) => {
        updated[c] = enableAllNext ? 'available' : 'excluded';
      });
      return updated;
    });
    if (!enableAllNext) {
      setLetterGroups('');
    }
    setEnableAllNext(!enableAllNext);
  };

  const handleSortChange = (sortOrder: SortOrder) => {
    setSortOrder(sortOrder);
  };

  const handleShowGroups = () => {
    setLetterGroups(calculateGroups(letterStatuses, letterGroups));
    setShowLetterGroups(true);
  };

  return (
    <div className="max-w-3xl mx-auto p-2 flex flex-col h-dvh overflow-hidden gap-1">
      <header className="flex items-center justify-between flex-none py-0.5">
        <h1 className="flex flex-col items-center text-2xl font-bold gap-0.5">
          <div className="flex gap-0.5">
            {"LETTER".split("").map((ch, i) => (
              <span
                key={i}
                className={`${getLetterButtonClasses(
                  ch === "L"
                    ? "required-start"
                    : ch === "R"
                    ? "required-end"
                    : "available",
                  false,
                  true,
                )} w-6 inline-flex items-center justify-center`}
              >
                {ch}
              </span>
            ))}
          </div>
          <div className="flex gap-0.5">
            {"UNBOXED".split("").map((ch, i) => (
              <span
                key={i}
                className={`${getLetterButtonClasses(
                  ch === "D"
                    ? "required-end"
                    : ch === "X"
                    ? "required-anywhere"
                    : "available",
                  false,
                  true,
                )} w-6 inline-flex items-center justify-center`}
              >
                {ch}
              </span>
            ))}
          </div>
        </h1>
        <button
          aria-label={showHelp ? "Close help" : "Open help"}
          onClick={() => setShowHelp(!showHelp)}
          className={`${getLetterButtonClasses('excluded', false, true)} w-8 h-8 flex items-center justify-center`}
        >
          ?
        </button>
      </header>
      {showHelp && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg mx-4 shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">About</h2>
              <button
                aria-label="Close help"
                onClick={() => setShowHelp(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                &times;
              </button>
            </div>
            <div className="space-y-4 text-gray-700">
              <p>
                Explore potential Letter Boxed words, find anagrams and learn
                words that start or end with specific letters.
              </p>
              <p>Tap letters to cycle through modes:</p>
              <div className="flex flex-wrap justify-center gap-2">
                <span className="px-3 py-1 text-xs font-bold rounded border-2 border-blue-700 bg-gradient-to-br from-blue-500 to-blue-700 text-white">
                  Available
                </span>
                <span className="px-3 pl-1 py-1 text-xs font-bold rounded border-2 border-white bg-gradient-to-br from-green-600 to-green-800 text-white">
                  Start
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded border-2 border-white bg-gradient-to-br from-green-600 to-green-800 text-white">
                  Must contain
                </span>
                <span className="px-3 pr-1 py-1 text-xs font-bold rounded border-2 border-white bg-gradient-to-br from-green-600 to-green-800 text-white">
                  End
                </span>
                <span className="px-3 py-1 text-xs font-bold rounded border-2 border-gray-700 bg-gray-600 text-gray-300">
                  Excluded
                </span>
              </div>
              <p>
                Drag letters into groups to stop them being used consecutively.
              </p>
              <div className="flex items-center space-x-2">
                <label htmlFor="sortOrder" className="text-sm">Sort:</label>
                <select
                  id="sortOrder"
                  value={sortOrder}
                  onChange={(e) =>
                    handleSortChange(
                      e.target.value as
                        | 'alphabetical-asc'
                        | 'alphabetical-desc'
                        | 'length-asc'
                        | 'length-desc'
                    )
                  }
                  className="px-2 py-1 border border-gray-400 rounded-md text-sm"
                >
                  <option value="alphabetical-asc">A-Z</option>
                  <option value="alphabetical-desc">Z-A</option>
                  <option value="length-asc">Shortest</option>
                  <option value="length-desc">Longest</option>
                </select>
              </div>
              <p>
                <a
                  href="https://dave.engineer"
                  className="underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Made by Dave
                </a>
                {" · "}
                <a
                  href="https://github.com/dave1010/letter-unboxed"
                  className="underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View code on GitHub
                </a>
              </p>
              <p>
                <a
                  href="http://wordlist.aspell.net/"
                  className="underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Word list from SCOWL
                </a>
              </p>
              <p>
                <a
                  href="https://www.nytimes.com/puzzles/letter-boxed"
                  className="underline text-blue-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Not affiliated with NYT Letter Boxed
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="flex-grow overflow-y-auto">
        <WordResults
          results={results}
          lettersSelected={Object.values(letterStatuses).some(
            (status) =>
              status === "available" || status.startsWith("required")
          )}
        />
      </div>
      <div className="flex-none">
        {!showLetterGroups && (
          <LetterSelector
            letterStatuses={letterStatuses}
            onLetterClick={handleLetterClick}
            onShowGroups={handleShowGroups}
            onToggleAll={handleToggleAll}
            toggleAllNext={enableAllNext}
          />
        )}
        {showLetterGroups && (
          <LetterGroupsDisplay
            letterStatuses={letterStatuses}
            letterGroups={letterGroups}
            onGroupsChange={setLetterGroups}
            onShowLetters={() => setShowLetterGroups(false)}
          />
        )}
      </div>
    </div>
  );
}
