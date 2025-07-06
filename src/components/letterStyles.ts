export type LetterStatus = 'available' | 'required-start' | 'required-anywhere' | 'required-end' | 'excluded';

export function getLetterButtonClasses(status: LetterStatus, interactive = true): string {
  const base = `py-2 text-lg font-bold rounded transition border-2 shadow-md${interactive ? ' hover:scale-105' : ''}`;
  const alignClass =
    status === 'required-start'
      ? 'text-left pl-0'
      : status === 'required-end'
      ? 'text-right pr-0'
      : 'text-center';
  const statusClasses =
    status === 'available'
      ? `bg-gradient-to-br from-blue-500 to-blue-700 text-white border-blue-700 ${alignClass}`
      : status.startsWith('required')
      ? `bg-gradient-to-br from-green-600 to-green-800 text-white border-green-800 ${alignClass}`
      : `bg-gray-600 text-gray-300 border-gray-700 ${alignClass}`;
  return `${base} ${statusClasses}`;
}
