# Roadmap: Letter Unboxed

This document outlines the development plan for the "Letter Unboxed" tool.

Check tasks only when they are *fully* complete. If tangible progress has been made but
a task is not complete then split up the task.

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
- [ ] Set up a Vercel project for deployment
- [ ] Configure Vercel to create preview deployments for PRs
- [ ] Configure automatic deployments from the main branch

## Phase 2: Core Functionality & MVP

This phase focuses on getting the basic, essential features working to have a usable product.

### Dictionary Management
- [ ] Research and find a suitable, permissively licensed word list
- [ ] Create a smaller, curated word list for development and testing
- [ ] Define a format for the dictionary, a format that a full text search DB uses or something else.
- [ ] Write a script to process the raw word list into the defined format
- [ ] Run some performance tests

### Core Logic (TypeScript)
- [ ] Implement the core word-filtering logic
    - [ ] Filter words based on available letters
- [ ] Ensure the core logic is a separate, testable module
- [ ] Write comprehensive unit tests for the core logic

### Basic Web UI (MVP)
- [ ] Create a simple page layout
- [ ] Implement the letter selection UI (e.g., buttons for letters)
- [ ] Implement a basic 3-way toggle for letter selection:
    - [ ] Can be used (default)
    - [ ] Must be used
    - [ ] Can't be used
- [ ] Display the list of matching words
- [ ] Implement live updates as letter selections change
- [ ] Write integration tests for the UI components

### Basic CLI
- [ ] Set up a basic CLI entry point (e.g., using `commander` or `yargs`)
- [ ] Implement CLI command to take letters as input
- [ ] Implement CLI flags for "must use" and "can't use" letters
- [ ] Print matching words to the console

## Phase 3: Feature Enhancement & UX

This phase builds on the MVP to add more powerful features and improve the user experience.

### Advanced Filtering
- [ ] Implement filter: word must start with a specific letter
- [ ] Implement filter: word must end with a specific letter
- [ ] Combine multiple filters effectively
- [ ] Consider other features (user task)

### UI/UX Improvements
- [ ] Design a more polished and intuitive user interface
- [ ] Implement a better way to display a large number of results (e.g., pagination, virtual scrolling)
- [ ] Make the UI responsive for different screen sizes

### Offline Support
- [ ] Implement service workers to cache the application shell and data
- [ ] Ensure the application is fully functional without an internet connection after the first visit

## Phase 4: Production Readiness & Polish

This phase focuses on making the project robust, maintainable, and easy to deploy.

### Advanced UI
- [ ] Explore and implement a more "awesome/cool" UI with animations
- [ ] Investigate the feasibility of a simple 3D-like interface element

## Future Ideas / Backlog

- [ ] **Pluggable Dictionaries:** Allow users to provide their own word lists. Ensure code supports tbis from the start.
- [ ] **Game-Specific Helpers:** Add features tailored to finding two-word solutions for Letter Boxed.
