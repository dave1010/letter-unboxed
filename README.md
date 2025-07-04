# Letter Unboxed

This is a tool designed to explore words for the NYT game "Letter Boxed".
It can be used to "cheat", to help you out or to find alternative solutions.
It doesn't just give complete solutions to Letter Boxed but provides
tools to help you solve it.

## Development

tbc. whatever is easy to build and deploy to vercel, develop and test.

single page app.
ideally works offline.

## Dictionary Word Lists

tbc. need to find some dictionaries. ideally similar to what NYT use.
need to be permisively licenced. maybe pluggable.
might want a smaller list for testing.

will need to consider data format and delivery.
1MB or so of JSON is probably fine.

## Features

essentially a fancy version if grepping a word list.
letter selection toggle (could be a keyboard).
3 way toggle: letter can be used, letter must be used, letter cant be used.

list of all matching words
live updating. clinet side JS if its performant enouch

other features based on whats useful for NYT Letter Boxed and similar games.
eg words must start or end with specific letter

## Display

awesome / cool UI that perhaps looks 3D.
there might be lots of matching results

## Code

production ready typescript.
testable code, with unit tests.
unit tests running on CI
command line interface to the tool, with feature parity as the web UI.
MVP first: quality code and UI but just basic features. then iterate.

y
