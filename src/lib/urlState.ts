import type { LetterStatus } from '../components/letterStyles';
import type { SortOrder } from '../components/WordResults';

const alphabet = 'abcdefghijklmnopqrstuvwxyz';

const statusToCode: Record<LetterStatus, string> = {
  excluded: '0',
  available: '1',
  'required-start': '2',
  'required-anywhere': '3',
  'required-end': '4',
};

const codeToStatus: Record<string, LetterStatus> = {
  '0': 'excluded',
  '1': 'available',
  '2': 'required-start',
  '3': 'required-anywhere',
  '4': 'required-end',
};

export function encodeState(
  letterStatuses: Record<string, LetterStatus>,
  letterGroups: string,
  sortOrder: SortOrder,
): string {
  const params = new URLSearchParams();
  const letters = alphabet
    .split('')
    .map(ch => statusToCode[letterStatuses[ch]])
    .join('');
  params.set('l', letters);
  if (letterGroups) params.set('g', letterGroups);
  if (sortOrder !== 'length-desc') params.set('o', sortOrder);
  return params.toString();
}

export function decodeState(hash: string): {
  letterStatuses: Record<string, LetterStatus>;
  letterGroups: string;
  sortOrder: SortOrder;
} {
  if (hash.startsWith('#')) hash = hash.slice(1);
  const params = new URLSearchParams(hash);
  const statuses: Record<string, LetterStatus> = {};
  alphabet.split('').forEach(ch => {
    statuses[ch] = 'excluded';
  });
  const letters = params.get('l');
  if (letters && letters.length === 26) {
    letters.split('').forEach((code, i) => {
      const char = alphabet[i];
      if (codeToStatus[code]) statuses[char] = codeToStatus[code];
    });
  }
  const groups = params.get('g') || '';
  const orderParam = params.get('o') as SortOrder | null;
  const order: SortOrder =
    orderParam &&
    ['alphabetical-asc', 'alphabetical-desc', 'length-asc', 'length-desc'].includes(orderParam)
      ? orderParam
      : 'length-desc';
  return { letterStatuses: statuses, letterGroups: groups, sortOrder: order };
}
