import { describe, it, expect, vi, beforeEach } from 'vitest';
import { solveCommandHandler } from './cli'; // Import the exported handler
import * as fs from 'fs';

// Mock fs.readFileSync
vi.mock('fs', () => ({
  readFileSync: vi.fn((path: string) => {
    if (path.includes('scowl_35.txt')) {
      return 'apple\nbanana\ncherry\ndate\negg\nfig\ngrape\nhoneydew\nice\njicama\nkiwi\nlemon\nmango\nnarwhal\norange\npear\nquince\nraspberry\nstrawberry\ntangerine\n';
    } else if (path.includes('scowl_100.txt')) {
      return 'apple\nbanana\n'; // A smaller dictionary for specific tests
    }
    throw new Error(`File not found: ${path}`);
  }),
}));

// Helper function to run the CLI command within tests
const runCli = async (args: string[]) => {
  const argv: any = {
    letters: '',
    mustUse: undefined,
    cannotUse: undefined,
    dictionary: './src/dictionary/scowl_35.txt', // Default dictionary
  };

  // Manually parse args to create argv object
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === 'solve') {
      argv.letters = args[++i];
    } else if (arg === '--must-use' || arg === '-m') {
      argv.mustUse = args[++i];
    } else if (arg === '--cannot-use' || arg === '-c') {
      argv.cannotUse = args[++i];
    } else if (arg === '--dictionary' || arg === '-d') {
      argv.dictionary = args[++i];
    }
  }

  return solveCommandHandler(argv);
};

describe('CLI', () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.clearAllMocks();
  });

  it('should solve a puzzle with basic letters', async () => {
    const result = await runCli(['solve', 'abcdefghijklmnopqrstuv']);
    expect(result.matchingWords).toEqual([
      'apple',
      'banana',
      'date',
      'egg',
      'fig',
      'grape',
      'ice',
      'jicama',
      'lemon',
      'mango',
      'orange',
      'pear',
      'quince',
      'tangerine',
    ]);
  });

  it('should filter words with --must-use flag', async () => {
    const result = await runCli(['solve', 'abcdefghijklmnopqrstuv', '--must-use', 'a']);
    expect(result.matchingWords).toEqual([
      'apple',
      'banana',
      'date',
      'grape',
      'jicama',
      'mango',
      'orange',
      'pear',
      'tangerine',
    ]);
  });

  it('should filter words with --cannot-use flag', async () => {
    const result = await runCli(['solve', 'abcdefghijklmnopqrstuv', '--cannot-use', 'a']);
    expect(result.matchingWords).toEqual([
      'egg',
      'fig',
      'ice',
      'lemon',
      'quince',
    ]);
  });

  it('should use the custom dictionary with --dictionary flag', async () => {
    const result = await runCli(['solve', 'abcdefghijklmnopqrstuv', '--dictionary', './src/dictionary/scowl_100.txt']);
    expect(result.matchingWords).toEqual([
      'apple',
      'banana',
    ]);
  });
});