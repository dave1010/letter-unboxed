import React from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  useDraggable,
} from '@dnd-kit/core';
import { LetterStatus, getLetterButtonClasses } from './letterStyles';
import { moveLetter } from '../lib/letterGroups';

interface LetterGroupsDisplayProps {
  letterStatuses: Record<string, LetterStatus>;
  letterGroups: string;
  onGroupsChange: (groups: string) => void;
  onShowLetters: () => void;
}

function DraggableLetter({ char, groupIndex, status }: { char: string; groupIndex: number; status: LetterStatus }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: char,
    data: { char, groupIndex },
  });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;
  return (
    <button
      ref={setNodeRef}
      style={style}
      aria-label={char.toUpperCase()}
      className={`${getLetterButtonClasses(status, false)} aspect-square w-12`}
      disabled
      {...listeners}
      {...attributes}
    >
      {char.toUpperCase()}
    </button>
  );
}

function LetterGroup({ letters, index, statuses }: { letters: string; index: number; statuses: Record<string, LetterStatus> }) {
  const { setNodeRef, isOver } = useDroppable({ id: index });
  return (
    <div
      ref={setNodeRef}
      className={`p-1 border-2 border-gray-500 rounded flex gap-1 min-w-14 ${isOver ? 'bg-gray-700/50' : ''}`}
    >
      {letters.split('').map((char) => (
        <DraggableLetter key={char} char={char} groupIndex={index} status={statuses[char]} />
      ))}
    </div>
  );
}

const LetterGroupsDisplay: React.FC<LetterGroupsDisplayProps> = ({ letterStatuses, letterGroups, onGroupsChange, onShowLetters }) => {
  const groups = letterGroups ? letterGroups.split(',').filter(Boolean) : [];
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const data = active.data.current as { char: string; groupIndex: number } | undefined;
    if (!data) return;
    const to = over ? Number(over.id) : null;
    const updated = moveLetter(groups, data.char, data.groupIndex, to);
    onGroupsChange(updated.join(','));
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="mb-6 text-center flex flex-wrap justify-center gap-2">
        {groups.map((group, index) => (
          <LetterGroup key={index} letters={group} index={index} statuses={letterStatuses} />
        ))}
        <button
          onClick={onShowLetters}
          className="py-2 px-4 text-lg font-bold rounded transition border-2 shadow-md hover:scale-105 bg-gray-600 text-gray-300 border-gray-700"
        >
          Letters
        </button>
      </div>
    </DndContext>
  );
};

export default LetterGroupsDisplay;
