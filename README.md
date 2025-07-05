# Letter Unboxed

This is a tool designed to explore words for the NYT game "Letter Boxed".
It can be used to "cheat", to help you out or to find alternative solutions.
It doesn't just give complete solutions to Letter Boxed but provides
tools to help you solve it.

## Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

To build the project for production:

```bash
npm run build
```

To run the tests:

```bash
npm test
```

To run the tests with UI:

```bash
npm run test:ui
```

## CLI Usage

To use the command-line interface, run:

```bash
npm run cli -- solve <letters> [options]
```

- `<letters>`: A string of all available letters for the puzzle (e.g., "abcdefghijkl").

Options:
  - `--must-use <letters>`, `-m <letters>`: Letters that must be present in the solution.
  - `--cannot-use <letters>`, `-c <letters>`: Letters that cannot be present in the solution.
  - `--dictionary <path>`, `-d <path>`: Path to a custom dictionary file (e.g., `src/dictionary/scowl_100.txt`). Defaults to `src/dictionary/scowl_35.txt`.

Example:

```bash
npm run cli -- solve abcdefghijkl -m a -c z -d src/dictionary/scowl_100.txt
```

The CLI now uses a combined filtering logic, so `--must-use` and `--cannot-use` flags are applied simultaneously.

## Development

This project is a Next.js application bootstrapped with `create-next-app` and uses TypeScript, Tailwind CSS, and Vitest for testing. Continuous Integration is set up with GitHub Actions.

## Dictionary Word Lists

The application uses a dictionary of words to find solutions. The main word list is located at `src/dictionary/scowl_35.txt`.

- **Source:** The word list is derived from SCOWL (Sets of Open-source Word Lists), which is permissively licensed.
- **Format:** The dictionary is a plain text file with one word per line.
- **Loading:** Words are loaded into a JavaScript `Set` for efficient lookups and filtering.
- **Performance:** The dictionary is designed to be performant, allowing for quick filtering of words based on available letters. Performance tests ensure that filtering a large dictionary can be done efficiently (e.g., under 100ms).

## Features

essentially a fancy version if grepping a word list.
letter selection toggle (could be a keyboard).
3 way toggle: letter can be used, letter must be used, letter cant be used.

list of all matching words
live updating. clinet side JS if its performant enouch

other features based on whats useful for NYT Letter Boxed and similar games.
eg words must start or end with specific letter

## Display

The web UI features a dark theme with an animated gradient background. Result panels use translucent backgrounds so the motion subtly shows through without affecting readability. This colourful style makes the app feel lively while still keeping focus on the puzzle results.

## Code

production ready typescript.
testable code, with unit tests.
unit tests running on CI
command line interface to the tool, with feature parity as the web UI.
MVP first: quality code and UI but just basic features. then iterate.

y
