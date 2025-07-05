import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Dictionary } from '../src/lib/dictionary.ts';
import * as fs from 'fs';

const defaultDictionaryPath = './src/dictionary/scowl_35.txt';

export const solveCommandHandler = async (argv: any) => {
  const defaultDictionaryPath = './src/dictionary/scowl_35.txt';
  const dictionaryPath = argv.dictionary as string || defaultDictionaryPath;
  let dictionary: Dictionary;
  try {
    const dictionaryContent = fs.readFileSync(dictionaryPath, 'utf-8');
    dictionary = new Dictionary(...dictionaryContent.split('\n').filter(word => word.length > 0));
  } catch (error) {
    console.error(`Error loading dictionary from ${dictionaryPath}:`, error);
    return {
      matchingWords: [],
      availableLetters: argv.letters,
      mustUse: argv['must-use'],
      cannotUse: argv['cannot-use'],
    };
  }

  const availableLetters = argv.letters.toLowerCase();
  const mustUseLetters = argv.mustUse ? argv.mustUse.toLowerCase() : '';
  const cannotUseLetters = argv.cannotUse ? argv.cannotUse.toLowerCase() : '';

  let matchingWords: string[] = [];

  if (mustUseLetters) {
    matchingWords = dictionary.filterAvailableRequire(availableLetters, mustUseLetters);
  } else {
    matchingWords = dictionary.filterAvailable(availableLetters);
  }

  if (cannotUseLetters) {
    const tempDictionary = new Dictionary(...matchingWords);
    matchingWords = tempDictionary.filterUnavailable(cannotUseLetters);
  }

  return {
    matchingWords,
    availableLetters: argv.letters,
    mustUse: argv['must-use'],
    cannotUse: argv['cannot-use'],
  };
};

if (require.main === module) {
  yargs(hideBin(process.argv))
    .command(
      'solve <letters>',
      'Solve Letter Boxed puzzle',
      (yargs) => {
        yargs.positional('letters', {
          describe: 'Letters for the puzzle, e.g., "abcdefghijkl"',
          type: 'string',
        });
        yargs.option('must-use', {
          alias: 'm',
          type: 'string',
          description: 'Letters that must be used in the solution',
        });
        yargs.option('cannot-use', {
          alias: 'c',
          type: 'string',
          description: 'Letters that cannot be used in the solution',
        });
        yargs.option('dictionary', {
          alias: 'd',
          type: 'string',
          description: 'Path to a custom dictionary file',
          default: defaultDictionaryPath,
        });
      },
      solveCommandHandler
    )
    .help()
    .alias('h', 'help')
    .parse(process.argv.slice(2), {}, (err, argv, output) => {
      if (output) {
        console.log(output);
      }
      if (argv && !err) {
        const { matchingWords, availableLetters, mustUse, cannotUse } = argv as any;
        console.log(`Solving for letters: ${availableLetters}`);
        console.log('\nMatching words:');
        matchingWords.forEach((word: string) => console.log(word));

        if (mustUse) {
          console.log(`Must use: ${mustUse}`);
        }
        if (cannotUse) {
          console.log(`Cannot use: ${cannotUse}`);
        }
      }
    });
}