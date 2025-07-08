import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Home from "../app/home-client";
import { describe, it, expect, vi } from "vitest";
import { encodeState, decodeState } from "../lib/urlState";
import type { LetterStatus } from "../components/letterStyles";

// Mock the Dictionary class
vi.mock("../lib/dictionary", () => ({
  Dictionary: vi.fn().mockImplementation((...words: string[]) => ({
    filter: vi.fn((available, required, unavailable) => {
      // Simple mock filtering logic for testing
      return words.filter((word) => {
        const wordChars = new Set(word.split(""));
        const availableSet = new Set(available.split(""));
        const requiredSet = new Set(required.split(""));
        const unavailableSet = new Set(unavailable.split(""));
        const allowedLettersSet = new Set([...availableSet, ...requiredSet]);

        // Check for required letters
        for (const char of requiredSet) {
          if (!wordChars.has(char)) return false;
        }
        // Check for unavailable letters
        for (const char of unavailableSet) {
          if (wordChars.has(char)) return false;
        }
        // Check that all characters in the word are either available or required
        for (const char of wordChars) {
          if (!allowedLettersSet.has(char)) return false;
        }
        return true;
      });
    }),
  })),
}));

describe("Home", () => {
  const mockWordList = ["cat", "dog", "apple", "banana", "act", "cot"];

  beforeEach(() => {
    window.location.hash = "";
  });

  it("renders the main heading", () => {
    render(<Home wordList={mockWordList} />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
  });

  it("initializes letter statuses to unavailable", () => {
    render(<Home wordList={mockWordList} />);
    // Check a few letters to ensure they are initially unavailable (greyed out)
    expect(screen.getByRole("button", { name: "A" })).toHaveClass(
      "bg-gray-600",
      "text-gray-300",
      "border-gray-700",
    );
    expect(screen.getByRole("button", { name: "Z" })).toHaveClass(
      "bg-gray-600",
      "text-gray-300",
      "border-gray-700",
    );
  });

  it("filters words based on letter status changes", async () => {
    render(<Home wordList={mockWordList} />);

    // Initially, a prompt should show as no letters are selected
    expect(screen.getByText('Tap letters to make them available.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tap again to require words to use them at the start, anywhere in the word or at the end.',
      ),
    ).toBeInTheDocument();

    // Click 'C' to make it available
    fireEvent.click(screen.getByRole("button", { name: "C" }));
    // Click 'A' to make it available
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    // Click 'T' to make it available
    fireEvent.click(screen.getByRole("button", { name: "T" }));

    // Now 'cat' and 'act' should be visible
    expect(await screen.findByText("cat")).toBeInTheDocument();
    expect(screen.getByText("act")).toBeInTheDocument();
    expect(screen.queryByText("dog")).not.toBeInTheDocument();

    // Click 'C' again to make it required
    fireEvent.click(screen.getByRole("button", { name: "C" }));
    // Now 'cat' and 'act' should be visible (as 'c' is required)
    expect(await screen.findByText("cat")).toBeInTheDocument();
    expect(screen.getByText("act")).toBeInTheDocument();

    // Click 'O' to make it available
    fireEvent.click(screen.getByRole("button", { name: "O" }));
    // Now 'cot' should be visible as well
    expect(await screen.findByText("cot")).toBeInTheDocument();
  });

  it("passes correct props to LetterSelector and WordResults", () => {
    render(<Home wordList={mockWordList} />);

    // Check if LetterSelector is rendered (by checking one of its internal elements)
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();

    // Check if WordResults is rendered (by checking the prompt message)
    expect(screen.getByText('Tap letters to make them available.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Tap again to require words to use them at the start, anywhere in the word or at the end.'
      )
    ).toBeInTheDocument();
  });

  it("toggles group view when Groups and Letters buttons are clicked", () => {
    render(<Home wordList={mockWordList} />);

    // Groups button should be visible and group view hidden initially
    expect(
      screen.queryByRole("button", { name: "Letters" }),
    ).not.toBeInTheDocument();
    const groupsButton = screen.getByRole("button", { name: "Groups" });
    fireEvent.click(groupsButton);
    // Now group view should show and keyboard hidden
    expect(screen.getByRole("button", { name: "Letters" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "A" })).not.toBeInTheDocument();
    const lettersButton = screen.getByRole("button", { name: "Letters" });
    fireEvent.click(lettersButton);
    expect(
      screen.queryByRole("button", { name: "Letters" }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "A" })).toBeInTheDocument();
  });

  it("shows selected letters as individual groups", () => {
    render(<Home wordList={mockWordList} />);

    // make some letters available/required
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "C" }));
    fireEvent.click(screen.getByRole("button", { name: "C" }));
    fireEvent.click(screen.getByRole("button", { name: "C" }));

    fireEvent.click(screen.getByRole("button", { name: "Groups" }));
    const letterButtons = screen
      .getAllByRole("button")
      .filter((btn) => /^[A-Z]$/.test(btn.textContent || ""));
    const letters = letterButtons.map((btn) => btn.textContent);
    expect(letters).toEqual(["A", "B", "C"]);
  });

  it("shows Cheat button in group view and alerts pairs", () => {
    const words = ["abc", "cdefghijkl"];
    render(<Home wordList={words} />);
    "abcdefghijkl".split("").forEach((l) => {
      fireEvent.click(screen.getByRole("button", { name: l.toUpperCase() }));
    });
    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});
    fireEvent.click(screen.getByRole("button", { name: "Groups" }));
    const cheatBtn = screen.getByRole("button", { name: "Cheat" });
    fireEvent.click(cheatBtn);
    expect(alertMock).toHaveBeenCalledWith("abc cdefghijkl");
    alertMock.mockRestore();
  });

  it("toggles all letters available and back", () => {
    render(<Home wordList={mockWordList} />);
    const toggle = screen.getByRole("button", { name: "Enable all letters" });
    fireEvent.click(toggle);
    expect(screen.getByRole("button", { name: "Clear all letters" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "A" })).toHaveClass("border-blue-700");
    const clear = screen.getByRole("button", { name: "Clear all letters" });
    fireEvent.click(clear);
    expect(screen.getByRole("button", { name: "Enable all letters" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "A" })).toHaveClass("border-gray-700");
  });

  it("clears letter groups when clearing all letters", () => {
    render(<Home wordList={mockWordList} />);
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    fireEvent.click(screen.getByRole("button", { name: "Groups" }));
    let letters = screen
      .getAllByRole("button")
      .filter((btn) => /^[A-Z]$/.test(btn.textContent || ""));
    expect(letters.map((btn) => btn.textContent)).toEqual(["A", "B"]);
    fireEvent.click(screen.getByRole("button", { name: "Letters" }));
    fireEvent.click(screen.getByRole("button", { name: "Enable all letters" }));
    fireEvent.click(screen.getByRole("button", { name: "Clear all letters" }));
    fireEvent.click(screen.getByRole("button", { name: "Groups" }));
    letters = screen
      .getAllByRole("button")
      .filter((btn) => /^[A-Z]$/.test(btn.textContent || ""));
    expect(letters).toEqual([]);
  });

  it("updates URL fragment with current state", async () => {
    render(<Home wordList={mockWordList} />);
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "Open help" }));
    fireEvent.change(screen.getByLabelText("Sort:"), {
      target: { value: "alphabetical-asc" },
    });
    await waitFor(() => {
      const state = decodeState(window.location.hash);
      expect(state.letterStatuses.a).toBe("available");
      expect(state.sortOrder).toBe("alphabetical-asc");
    });
  });

  it("initializes state from URL fragment", async () => {
    const statuses: Record<string, LetterStatus> = {};
    "abcdefghijklmnopqrstuvwxyz".split("").forEach((c) => {
      statuses[c] = "excluded";
    });
    statuses.b = "required-anywhere";
    statuses.c = "available";
    const encoded = encodeState(statuses, "b,c", "alphabetical-asc");
    window.location.hash = "#" + encoded;
    render(<Home wordList={mockWordList} />);
    const bBtn = await screen.findByRole("button", { name: "B" });
    expect(bBtn).toHaveClass("border-green-800");
    fireEvent.click(screen.getByRole("button", { name: "Open help" }));
    expect((screen.getByLabelText("Sort:") as HTMLSelectElement).value).toBe(
      "alphabetical-asc",
    );
    fireEvent.click(screen.getByRole("button", { name: "Groups" }));
    const letters = screen
      .getAllByRole("button")
      .filter((btn) => /^[A-Z]$/.test(btn.textContent || ""))
      .map((btn) => btn.textContent);
    expect(letters).toEqual(["B", "C"]);
  });

  it("updates groups when letters change after loading from fragment", async () => {
    const statuses: Record<string, LetterStatus> = {};
    "abcdefghijklmnopqrstuvwxyz".split("").forEach((c) => {
      statuses[c] = "excluded";
    });
    statuses.a = "available";
    const encoded = encodeState(statuses, "a", "length-desc");
    window.location.hash = "#" + encoded;
    render(<Home wordList={mockWordList} />);
    await screen.findByRole("button", { name: "A" });
    fireEvent.click(screen.getByRole("button", { name: "B" }));
    fireEvent.click(screen.getByRole("button", { name: "Groups" }));
    const letters = screen
      .getAllByRole("button")
      .filter((btn) => /^[A-Z]$/.test(btn.textContent || ""))
      .map((btn) => btn.textContent);
    expect(letters).toEqual(["A", "B"]);
  });

  it("cycles letter states when clicked repeatedly", () => {
    render(<Home wordList={mockWordList} />);
    const aBtn = screen.getByRole("button", { name: "A" });
    fireEvent.click(aBtn); // available
    expect(aBtn).toHaveClass("border-blue-700");
    fireEvent.click(aBtn); // required-start
    expect(aBtn).toHaveClass("pl-0");
    fireEvent.click(aBtn); // required-anywhere
    expect(aBtn).toHaveClass("border-green-800");
    fireEvent.click(aBtn); // required-end
    expect(aBtn).toHaveClass("pr-0");
    fireEvent.click(aBtn); // excluded again
    expect(aBtn).toHaveClass("border-gray-700");
  });

  it("opens and closes the help overlay", () => {
    render(<Home wordList={mockWordList} />);
    const open = screen.getByRole("button", { name: "Open help" });
    fireEvent.click(open);
    expect(screen.getByText("About")).toBeInTheDocument();
    const close = screen.getAllByRole("button", { name: "Close help" })[0];
    fireEvent.click(close);
    expect(screen.queryByText("About")).not.toBeInTheDocument();
  });

  it("sorts words alphabetically when selected", async () => {
    render(<Home wordList={mockWordList} />);
    fireEvent.click(screen.getByRole("button", { name: "C" }));
    fireEvent.click(screen.getByRole("button", { name: "A" }));
    fireEvent.click(screen.getByRole("button", { name: "T" }));
    fireEvent.click(screen.getByRole("button", { name: "Open help" }));
    fireEvent.change(screen.getByLabelText("Sort:"), {
      target: { value: "alphabetical-asc" },
    });
    await waitFor(() => {
      const words = screen.getAllByRole("listitem").map((li) => li.textContent);
      expect(words).toEqual(["act", "cat"]);
    });
  });
});
