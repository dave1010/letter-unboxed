import fs from 'fs';
import path from 'path';
import { ReactNode } from 'react';

interface WordListProviderProps {
  children: (wordList: string[]) => ReactNode;
}

export async function WordListProvider({ children }: WordListProviderProps) {
  const filePath = path.join(process.cwd(), 'src', 'dictionary', 'scowl_35.txt');
  const wordListContent = fs.readFileSync(filePath, 'utf-8');
  const wordList = wordListContent.split('\n').map(word => word.trim()).filter(word => word.length > 0);

  return (
    <>
      {children(wordList)}
    </>
  );
}
