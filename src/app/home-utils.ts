export const alphabet = "abcdefghijklmnopqrstuvwxyz";

import type { LetterStatus } from "../components/letterStyles";
import type { SortOrder } from "../components/WordResults";
import { Dictionary } from "../lib/dictionary";

export function createDefaultStatuses(): Record<string, LetterStatus> {
  const statuses: Record<string, LetterStatus> = {};
  alphabet.split("").forEach((char) => {
    statuses[char] = "excluded";
  });
  return statuses;
}

export const cycleMap: Record<LetterStatus, LetterStatus> = {
  excluded: "available",
  available: "required-start",
  "required-start": "required-anywhere",
  "required-anywhere": "required-end",
  "required-end": "excluded",
};

export function computeResults(
  dictionary: Dictionary | null,
  letterStatuses: Record<string, LetterStatus>,
  sortOrder: SortOrder,
  letterGroups: string,
): string[] {
  if (!dictionary) return [];

  const availableLetters = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "available")
    .join("");
  const requiredAnywhere = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "required-anywhere")
    .join("");
  const requiredStart = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "required-start")
    .join("");
  const requiredEnd = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "required-end")
    .join("");
  const excludedLetters = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "excluded")
    .join("");

  const filteredWords = dictionary.filter(
    availableLetters,
    requiredAnywhere + requiredStart + requiredEnd,
    excludedLetters,
    requiredStart,
    requiredEnd,
    letterGroups,
  );

  const sortedWords = [...filteredWords];
  switch (sortOrder) {
    case "alphabetical-asc":
      sortedWords.sort();
      break;
    case "alphabetical-desc":
      sortedWords.sort().reverse();
      break;
    case "length-asc":
      sortedWords.sort((a, b) => a.length - b.length || a.localeCompare(b));
      break;
    case "length-desc":
      sortedWords.sort((a, b) => b.length - a.length || a.localeCompare(b));
      break;
  }
  return sortedWords.slice(0, 1000);
}

export function calculateGroups(
  letterStatuses: Record<string, LetterStatus>,
  letterGroups: string,
): string {
  const selected = Object.keys(letterStatuses)
    .filter(
      (char) =>
        letterStatuses[char] === "available" ||
        letterStatuses[char].startsWith("required"),
    )
    .sort();

  const selectedSet = new Set(selected);
  let groups = letterGroups ? letterGroups.split(",").filter(Boolean) : [];

  if (!letterGroups) {
    groups = selected.map((ch) => ch);
  } else {
    groups = groups
      .map((g) =>
        g
          .split("")
          .filter((ch) => selectedSet.has(ch))
          .join("")
      )
      .filter((g) => g);

    const grouped = new Set(groups.join(""));
    selected.forEach((ch) => {
      if (!grouped.has(ch)) groups.push(ch);
    });
  }

  return groups.join(",");
}

export function findCheatPairs(
  dictionary: Dictionary | null,
  letterStatuses: Record<string, LetterStatus>,
  letterGroups: string,
): string[] {
  if (!dictionary) return [];

  const availableLetters = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "available")
    .join("");
  const requiredAnywhere = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "required-anywhere")
    .join("");
  const requiredStart = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "required-start")
    .join("");
  const requiredEnd = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "required-end")
    .join("");
  const excludedLetters = Object.keys(letterStatuses)
    .filter((char) => letterStatuses[char] === "excluded")
    .join("");

  const filtered = dictionary.filter(
    availableLetters,
    requiredAnywhere + requiredStart + requiredEnd,
    excludedLetters,
    requiredStart,
    requiredEnd,
    letterGroups,
  );

  const selectedLetters = (
    availableLetters + requiredAnywhere + requiredStart + requiredEnd
  ).split("");
  const selectedSet = new Set(selectedLetters);

  const pairs: string[] = [];
  for (const w1 of filtered) {
    for (const w2 of filtered) {
      if (w1[w1.length - 1] !== w2[0]) continue;
      if (w1.length + w2.length < 12) continue;
      const combined = w1 + w2;
      let usesAll = true;
      for (const ch of selectedSet) {
        if (!combined.includes(ch)) {
          usesAll = false;
          break;
        }
      }
      if (usesAll) pairs.push(`${w1} ${w2}`);
    }
  }
  return pairs;
}
