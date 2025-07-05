import HomeClient from './home-client';
import fs from 'fs';
import path from 'path';

export default async function Home() {
  const filePath = path.join(process.cwd(), 'src', 'dictionary', 'scowl_35.txt');
  const wordListContent = fs.readFileSync(filePath, 'utf-8');
  const wordList = wordListContent
    .split('\n')
    .map(word => word.trim())
    .filter(word => word.length > 0);
  return <HomeClient wordList={wordList} />;
}
