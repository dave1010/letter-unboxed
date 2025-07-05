# Roadmap: Letter Unboxed

This document outlines the development plan for the "Letter Unboxed" tool.

Check tasks only when they are *fully* complete. I.e. not just changing code.

- A task is only complete [x] when you have seen the output of a passing test, docs updated, etc.
  If tangible progress has been made but a task is not complete then split the task into 2 or more tasks.
- Mark a checkbox as [.] if the code is there but you haven't met the Definition of Done.
  Never do this, unless explicitly asked!
- Mark a checkbox as [?] if tangible work has been done but there is a problem and
  it can't be completed properly.

Keep README.md up to date with how to run/use the project.

## Phase 1: Infrastructure & Setup

This phase focuses on getting the project foundation right, with automated testing and deployment previews from the start, before functional code is written.

### Project Setup
- [x] Initialize project repository
- [x] Set up TypeScript project structure
- [x] Choose and configure a framework (e.g., React/Next.js for Vercel)
- [x] Set up basic build and development scripts

### Testing & CI/CD
- [x] Set up a Continuous Integration (CI) pipeline (e.g., GitHub Actions)
- [x] Configure CI to run tests on every push/PR
- [x] Set up a test runner (e.g., Jest, Vitest) and add a placeholder test to ensure the CI pipeline is working.

### Deployment
- [x] Set up a Vercel project for deployment
- [x] Configure Vercel to create preview deployments for PRs
- [x] Configure automatic deployments from the main branch

## Phase 2: Core Functionality & MVP

This phase focuses on getting the basic, essential features working to have a usable product.

### Dictionary Management
- [x] Researched and found a suitable, permissively licensed word list (en-wl/wordlist)
- [x] Created a smaller, curated word list for development and testing (scowl_35.txt - 43k words)
- [x] Make a 100 word dictionary file for other tests
- [x] Defined a format for the dictionary: a plain text file with one word per line. This can be loaded into a JavaScript Set for efficient lookups.
- [ ] Write a script to process the raw word list into the defined format
- [x] Create a robust way to load dictionaries so its available to a CLI script (and later web)
- [x] Create some test lookup query / regex that mimmick the functionality we'll create later
- [x] Run some performance tests to ensure a smaller dict can be searched in under 500ms
- [ ] Research suitable dictionary size for production use (extensive perf testing needed)
- [ ] Configure dictionary creation script to be close to NYT Letter Boxed rules (eg non proper nouns)

### Core Logic (TypeScript)
- [x] Implemented the basic word-filtering logic
    - [x] Filtered words based on available letters
- [x] Ensured the core logic is a separate, testable module
- [x] Wrote comprehensive unit tests for the core logic
- [ ] Ensure this will be suitable format for future phases

### Basic CLI
- [x] Set up a basic CLI entry point (e.g., using `commander` or `yargs`)
- [x] Implement CLI command to take letters as input
- [x] Implement CLI flags for "must use" and "can't use" letters
- [x] Print matching words to the console
- [x] CLI uses the new `filter` method


### Basic Web UI (MVP)
- [x] Create a simple page layout
- [x] Implement the letter selection UI (e.g., buttons for letters)
- [x] Implement a basic 3-way toggle for letter selection:
    - [x] Can be used (default)
    - [x] Must be used
    - [x] Can't be used
- [x] Display the list of matching words
- [x] Implement live updates as letter selections change
- [ ] Write integration tests for the UI components

## Phase 3: Feature Enhancement & UX

This phase builds on the MVP to add more powerful features and improve the user experience.

### Results view (web and CLI)

- [x] Show count of results
- [x] Sorting results A-Z, length, asc/desc
- [x] Limit (defailt to 1000 just on web)

### Advanced Filtering
- [x] Implement filter: word must start with a specific letter
- [x] Implement filter: word must end with a specific letter
- [x] Combine multiple filters effectively
- [x] Restrict "movement". I.e. consecutive letters in a word can't use letters from the same group.
      Eg allowing letters "abc,def" allows word "dad" but not "ade" or "add".
      This should be optional in the CLI. Might be an advanced option for web UI.
      Also this allows putting every letter in its own group, which will block using the same letter twice.
- [ ] Consider other features (user task)

### UI/UX Improvements
- [x] Design a more polished and intuitive user interface
- [x] Text logo
- [x] About / help popup
- [x] Implement a better way to display a large number of results (e.g., scrolling just the div)
- [x] Make the UI responsive for different screen sizes

### Offline Support
- [ ] Implement service workers to cache the application shell and data
- [ ] Ensure the application is fully functional without an internet connection after the first visit

### Advanced UI
- [ ] Explore and implement a more "awesome/cool" UI with animations
- [ ] Investigate the feasibility of a simple 3D-like interface element

## Future Ideas / Backlog

- [ ] **Optimize Dictionary Performance:** Further optimize the `Dictionary` class to achieve filtering times under 100ms for large word lists.
- [ ] **Game-Specific Helpers:** Add features tailored to finding two-word solutions for Letter Boxed.
