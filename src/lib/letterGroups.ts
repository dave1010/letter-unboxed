function sortLetters(group: string): string {
  return group.split('').sort().join('');
}

export function moveLetter(
  groups: string[],
  char: string,
  from: number,
  to: number | null,
): string[] {
  const updated = [...groups];
  updated[from] = updated[from].replace(char, '');
  const removed = updated[from] === '';
  if (removed) {
    updated.splice(from, 1);
  }
  if (to === null) {
    updated.push(char);
  } else {
    let target = to;
    if (removed && from < to) {
      target -= 1;
    }
    if (target >= updated.length) {
      updated.push(char);
    } else {
      updated[target] = (updated[target] || '') + char;
    }
  }
  return updated.map(sortLetters);
}

export function getInsertionIndex(group: string, char: string): number {
  const letters = group.split('');
  for (let i = 0; i < letters.length; i++) {
    if (char < letters[i]) return i;
  }
  return letters.length;
}
