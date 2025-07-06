import React, { useState } from 'react';
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
  useDraggable,
  DragOverlay,
} from '@dnd-kit/core';
import { LetterStatus, getLetterButtonClasses } from './letterStyles';
import { moveLetter, getInsertionIndex } from '../lib/letterGroups';

interface LetterGroupsDisplayProps {
  letterStatuses: Record<string, LetterStatus>;
  letterGroups: string;
  onGroupsChange: (groups: string) => void;
  onShowLetters: () => void;
}

function DraggableLetter({ char, groupIndex, status }: { char: string; groupIndex: number; status: LetterStatus }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: char,
    data: { char, groupIndex },
    attributes: { tabIndex: -1 },
  });
  const style = isDragging
    ? { position: 'absolute', width: 0, height: 0 }
    : transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  const widthClass = isDragging ? '' : 'w-12';
  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      aria-label={char.toUpperCase()}
      className={`${getLetterButtonClasses(status, false)} aspect-square ${widthClass} touch-none${
        isDragging ? ' pointer-events-none' : ''
      }`}
      {...listeners}
      {...attributes}
    >
      {char.toUpperCase()}
    </button>
  );
}

function LetterGroup({
  letters,
  index,
  statuses,
  isDropTarget,
  insertionIndex,
  activeChar,
  draggingFrom,
}: {
  letters: string;
  index: number;
  statuses: Record<string, LetterStatus>;
  isDropTarget: boolean;
  insertionIndex: number | null;
  activeChar: string | null;
  draggingFrom: number | null;
}) {
  const { setNodeRef } = useDroppable({ id: index });
  const adjustedLetters =
    draggingFrom === index && activeChar ? letters.replace(activeChar, '') : letters;
  if (adjustedLetters.length === 0 && !isDropTarget) {
    return null;
  }
  const placeholder = isDropTarget ? 1 : 0;
  const widthRem = Math.max(1, adjustedLetters.length + placeholder) * 3.5;
  return (
    <div
      ref={setNodeRef}
      style={{ width: `${widthRem}rem` }}
      className={`p-1 border-2 rounded flex gap-1 min-w-14 transition-all duration-200 ${
        isDropTarget ? 'border-blue-500 bg-blue-800/50' : 'border-gray-500'
      }`}
    >
      {adjustedLetters.split('').map((char, i) => (
        <React.Fragment key={char}>
          {isDropTarget && insertionIndex === i && (
            <span className="w-12 border-2 border-dashed border-blue-400 rounded" />
          )}
          <DraggableLetter char={char} groupIndex={index} status={statuses[char]} />
        </React.Fragment>
      ))}
      {isDropTarget && insertionIndex === adjustedLetters.length && (
        <span className="w-12 border-2 border-dashed border-blue-400 rounded" />
      )}
    </div>
  );
}

const LetterGroupsDisplay: React.FC<LetterGroupsDisplayProps> = ({
  letterStatuses,
  letterGroups,
  onGroupsChange,
  onShowLetters,
}) => {
  const groups = letterGroups ? letterGroups.split(',').filter(Boolean) : [];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 0 } }));

  const [activeChar, setActiveChar] = useState<string | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [draggingFrom, setDraggingFrom] = useState<number | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as { char: string; groupIndex: number } | undefined;
    setActiveChar(data?.char || null);
    setDraggingFrom(typeof data?.groupIndex === 'number' ? data.groupIndex : null);
    setOverIndex(typeof data?.groupIndex === 'number' ? data.groupIndex : null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    setOverIndex(event.over ? Number(event.over.id) : null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    const data = active.data.current as { char: string; groupIndex: number } | undefined;
    if (!data) return;
    const to = over ? Number(over.id) : null;
    const updated = moveLetter(groups, data.char, data.groupIndex, to);
    onGroupsChange(updated.join(','));
    setActiveChar(null);
    setOverIndex(null);
    setDraggingFrom(null);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="mb-6 text-center flex flex-wrap justify-center gap-2">
        {groups.map((group, index) => (
          <LetterGroup
            key={index}
            letters={group}
            index={index}
            statuses={letterStatuses}
            isDropTarget={overIndex === index}
            insertionIndex={
              activeChar && overIndex === index
                ? getInsertionIndex(
                    draggingFrom === index && activeChar ? group.replace(activeChar, '') : group,
                    activeChar,
                  )
                : null
            }
            activeChar={activeChar}
            draggingFrom={draggingFrom}
          />
        ))}
        <button
          onClick={onShowLetters}
          className="py-2 px-4 text-lg font-bold rounded transition border-2 shadow-md hover:scale-105 bg-gray-600 text-gray-300 border-gray-700"
        >
          Letters
        </button>
      </div>
      <DragOverlay>
        {activeChar ? (
          <button className={`${getLetterButtonClasses(letterStatuses[activeChar], false)} aspect-square w-12 touch-none`}>
            {activeChar.toUpperCase()}
          </button>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default LetterGroupsDisplay;
