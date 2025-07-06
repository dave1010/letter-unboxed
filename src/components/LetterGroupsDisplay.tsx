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
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;
  return (
    <button
      ref={setNodeRef}
      type="button"
      style={style}
      aria-label={char.toUpperCase()}
      className={`${getLetterButtonClasses(status, false)} aspect-square w-12 touch-none ${isDragging ? 'opacity-0' : ''}`}
      {...listeners}
      {...attributes}
    >
      {char.toUpperCase()}
    </button>
  );
}

function LetterGroup({ letters, index, statuses, isDropTarget, insertionIndex }: { letters: string; index: number; statuses: Record<string, LetterStatus>; isDropTarget: boolean; insertionIndex: number | null }) {
  const { setNodeRef } = useDroppable({ id: index });
  return (
    <div
      ref={setNodeRef}
      className={`p-1 border-2 rounded flex gap-1 min-w-14 ${isDropTarget ? 'border-blue-500 bg-blue-800/50' : 'border-gray-500'}`}
    >
      {letters.split('').map((char, i) => (
        <React.Fragment key={char}>
          {isDropTarget && insertionIndex === i && (
            <span className="w-12 border-2 border-dashed border-blue-400 rounded" />
          )}
          <DraggableLetter char={char} groupIndex={index} status={statuses[char]} />
        </React.Fragment>
      ))}
      {isDropTarget && insertionIndex === letters.length && (
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

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current as { char: string; groupIndex: number } | undefined;
    setActiveChar(data?.char || null);
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
            insertionIndex={activeChar && overIndex === index ? getInsertionIndex(group, activeChar) : null}
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
