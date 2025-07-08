import { describe, it, expect } from "vitest";
import { Dictionary } from "../lib/dictionary";
import {
  createDefaultStatuses,
  cycleMap,
  computeResults,
  calculateGroups,
  findCheatPairs,
} from "./home-utils";
import type { LetterStatus } from "../components/letterStyles";

describe("home-utils", () => {
  it("createDefaultStatuses returns all letters excluded", () => {
    const statuses = createDefaultStatuses();
    expect(Object.keys(statuses)).toHaveLength(26);
    for (const status of Object.values(statuses)) {
      expect(status).toBe("excluded");
    }
  });

  it("cycleMap cycles statuses", () => {
    expect(cycleMap["excluded"]).toBe("available");
    expect(cycleMap["available"]).toBe("required-start");
    expect(cycleMap["required-start"]).toBe("required-anywhere");
    expect(cycleMap["required-anywhere"]).toBe("required-end");
    expect(cycleMap["required-end"]).toBe("excluded");
  });

  it("computeResults filters and sorts words", () => {
    const dict = new Dictionary("cat", "cot", "dog", "cart");
    const statuses = createDefaultStatuses();
    statuses.c = "available";
    statuses.a = "available";
    statuses.t = "available";
    statuses.o = "available";
    const res = computeResults(dict, statuses, "alphabetical-asc", "");
    expect(res).toEqual(["cat", "cot"]);
  });

  it("calculateGroups returns expected grouping", () => {
    const statuses: Record<string, LetterStatus> = createDefaultStatuses();
    statuses.a = "available";
    statuses.b = "required-anywhere";
    let groups = calculateGroups(statuses, "");
    expect(groups).toBe("a,b");

    statuses.c = "available";
    groups = calculateGroups(statuses, "ab,cd");
    expect(groups).toBe("ab,c");
  });

  it("findCheatPairs finds word pairs using all letters", () => {
    const dict = new Dictionary("abc", "cdefghijkl", "xyz");
    const statuses = createDefaultStatuses();
    "abcdefghijkl".split("").forEach((c) => {
      statuses[c] = "available";
    });
    const pairs = findCheatPairs(dict, statuses, "");
    expect(pairs).toEqual(["abc cdefghijkl"]);
  });
});
