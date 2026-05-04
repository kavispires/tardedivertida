import { useDroppable } from '@dnd-kit/core';

export const GridSlot = ({ index }: { index: number }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    data: { index },
  });

  return (
    <div
      ref={setNodeRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          border: '1px solid rgba(255,255,255,0.05)',
          backgroundColor: isOver ? 'rgba(255,255,255,0.1)' : 'transparent',
        }}
      />
    </div>
  );
};
