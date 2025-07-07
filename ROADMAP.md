# Roadmap: Letter Unboxed

This document outlines the development plan for the **Letter Unboxed** tool.
Tasks are only checked when fully complete (tests, docs and lint pass). Keep README.md updated with usage information.

## Phase 1: Infrastructure & Setup

- Project set up with TypeScript, Next.js, Vitest and CI. Deployment previews are created on each pull request.

## Phase 2: Core Functionality & MVP

### Dictionary Management
- Researched and selected a permissively licensed word list
- Created smaller word lists for development and tests
- Defined the plain text dictionary format and loading logic
- Created a robust loader shared by the CLI and web interface
- Built performance tests to ensure fast searches
- **TODO:** Research suitable dictionary size for production use
- **TODO:** Configure a dictionary creation script with Letter Boxed rules

### Core Logic (TypeScript)
- Implemented the basic word-filtering logic with comprehensive unit tests

### Basic CLI
- Added a CLI entry point with flags for required and excluded letters
- Uses the same filtering logic as the web UI

### Basic Web UI (MVP)
- Simple page layout with letter selection buttons
- Three-way toggle for each letter
- Live updates of matching words and integration tests

## Phase 3: Feature Enhancement & UX

### Results view
- Show count of results
- Sorting A–Z or by length
- Limit displayed results (default 1000 on the web)

### Advanced Filtering
- Filters for starting and ending letters
- Combine multiple filters, including optional group restrictions

### UI/UX Improvements
- Polished responsive interface with an About popup and text logo
- Large result lists scroll within the page

### Styling
- QWERTY layout for letter buttons and improved colour scheme
- Sort by longest word by default

### v1.1
- Refactored page components and improved tests. The components were too big and complex.
- Switching back and forth between letters and groups now persists the groups. For example, if there is a group ABC, then C is excluded, then made available again it will remain in the same group.
- Added a way to make all letters available or unavailable.
- Shifted the 2nd and 3rd lines of the keyboard right a bit.

### Offline Support
- **TODO:** Implement service workers to cache the application
- **TODO:** Ensure the site works after the first visit without a connection
