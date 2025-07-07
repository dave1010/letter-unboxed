# Letter Unboxed

Letter Unboxed helps you explore words for the NYT puzzle **Letter Boxed**. It provides a responsive web interface and a command-line tool to filter large dictionaries by the letters you have available.

**[Try it out at letter-unboxed.dave.engineer](https://letter-unboxed.dave.engineer/)**

## Features

- Toggle letters between **available**, **required**, and **excluded** states
- Optional grouping mode to restrict consecutive letters from using the same group
- Filters for words that must start or end with specific letters
- Sort results by length or alphabetically and limit how many are shown
- Identical filtering options are available in the CLI

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to use the app. Use the **Groups** button to place each selected letter in its own group. Press **Letters** to return to the keyboard mode.

### Building for Production

```bash
npm run build
```

### Testing and Linting

```bash
npm test
npm run lint
```

### CLI Usage

Run the command-line interface with:

```bash
npm run cli -- solve <letters> [options]
```

- `<letters>`: All letters available in the puzzle (e.g. `abcdefghijkl`).
- `--must-use <letters>` / `-m <letters>`: Letters that must appear in the result.
- `--cannot-use <letters>` / `-c <letters>`: Letters that must not appear.
- `--dictionary <path>` / `-d <path>`: Path to a custom dictionary file. Defaults to `src/dictionary/scowl_35.txt`.

Example:

```bash
npm run cli -- solve abcdefghijkl -m a -c z -d src/dictionary/scowl_100.txt
```

## Dictionary Word Lists

The default dictionary comes from the permissively licensed [**SCOWL** word lists](http://wordlist.aspell.net/). Files are plain text with one word per line and are loaded into a `Set` for fast filtering.

## Development Notes

This is a Next.js project using TypeScript, Tailwind CSS and Vitest. Continuous Integration runs tests and linting on each commit. See [ROADMAP.md](ROADMAP.md) for planned tasks.

The project was primarily built using OpenAI Codex Web, OpenAI Codex CLI, Google Gemini CLI and Google Jules.

## License

Released under the MIT License. See [LICENSE](LICENSE) for details.
