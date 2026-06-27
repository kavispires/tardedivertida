import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import clsx from 'clsx';
import { useCallback, useMemo } from 'react';
// Ant Design Resources
import { Space } from 'antd';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { DraggableItem, DroppableArea } from '@components/drag-and-drop/DragAndDrop';
// Internal
import type { ItemData } from '../utils/types';
import { ItemEntry } from './ItemEntry';

type MatchingPlayAreaProps = {
  pool: ItemData[];
  pairs: (string | null)[];
  setPairs: React.Dispatch<React.SetStateAction<(string | null)[]>>;
  pairsCount: number;
  disabled: boolean;
};

export function MatchingPlayArea({ pool, pairs, setPairs, pairsCount, disabled }: MatchingPlayAreaProps) {
  // Set up sensors to prevent accidental drags and support both mouse and touch
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts (allows clicks)
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        // delay: 250, // 250ms delay prevents scroll interference on mobile
        // tolerance: 5, // 5px tolerance to prevent accidental drags
        distance: 8, //
      },
    }),
  );

  const selectedPairs = useMemo(() => {
    return pairs.map((entry) => pool.find((item) => item.id === entry));
  }, [pairs, pool]);

  /**
   * Handles drag-and-drop operations for items between pool and slots
   * Supports four scenarios:
   * 1. Drag from pool to empty slot - adds item to slot
   * 2. Drag from pool to filled slot - replaces existing item
   * 3. Drag from slot to empty slot - moves item
   * 4. Drag from slot to filled slot - swaps items
   * 5. Click/tap from pool (no drop target) - adds to first empty slot
   */
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      const draggedItemId = String(active.id);
      // const isFromPool = !pairs.includes(draggedItemId);

      // If dropped outside a valid drop zone
      if (!over) {
        return;
      }

      const targetId = String(over.id);

      // Only handle drops on slot targets
      if (!targetId.startsWith('slot-')) return;

      const targetSlotIndex = Number.parseInt(targetId.replace('slot-', ''), 10);

      setPairs((prev) => {
        const newPairs = [...prev];
        const sourceSlotIndex = newPairs.indexOf(draggedItemId);
        const targetItemId = newPairs[targetSlotIndex];

        if (sourceSlotIndex === -1) {
          // Dragging from pool to slot
          if (targetItemId === null) {
            // Pool -> empty slot: add item
            newPairs[targetSlotIndex] = draggedItemId;
          } else {
            // Pool -> filled slot: replace item
            newPairs[targetSlotIndex] = draggedItemId;
          }
        } else {
          // Dragging from slot to slot
          if (targetItemId === null) {
            // Slot -> empty slot: move item
            newPairs[sourceSlotIndex] = null;
            newPairs[targetSlotIndex] = draggedItemId;
          } else {
            // Slot -> filled slot: swap items
            newPairs[sourceSlotIndex] = targetItemId;
            newPairs[targetSlotIndex] = draggedItemId;
          }
        }

        return newPairs;
      });
    },
    [setPairs],
  );

  /**
   * Removes an item from its slot and returns it to the pool
   */
  const removeItem = (key: string) => {
    setPairs((prev) => {
      const copy = [...prev];
      const index = copy.indexOf(key);
      if (index !== -1) {
        // If a non-string element is found, add the key at that index
        copy[index] = null;
      }

      return copy;
    });
  };

  /**
   * Handles clicking an item in the pool to auto-fill the first empty slot
   */
  const handleItemClick = useCallback(
    (id: string) => {
      if (disabled) return;

      setPairs((prev) => {
        const copy = [...prev];
        const firstEmptyIndex = copy.findIndex((element) => element === undefined || element === null);

        if (firstEmptyIndex !== -1) {
          copy[firstEmptyIndex] = id;
        } else {
          copy.push(id);
        }

        return copy;
      });
    },
    [disabled, setPairs],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <Space
        className={clsx('pairs-grid', `pairs-grid--${pairsCount}`)}
        wrap
      >
        {Array.from({ length: pairsCount }).map((_, index) => {
          const firstItemIndex = index * 2;
          const secondItemIndex = firstItemIndex + 1;
          const firstItem = pairs[firstItemIndex];
          const secondItem = pairs[secondItemIndex];
          const selectedFirstItem = selectedPairs[firstItemIndex];
          const selectedSecondItem = selectedPairs[secondItemIndex];
          const placeholder =
            pool[0].type === 'alien-item'
              ? { ...pool[0], value: { id: pool[0].id, name: { pt: '?', en: '?' } } }
              : pool[0];

          return (
            <Space
              className={clsx('pairs-grid__pair', `pairs-grid__pair--${index}`)}
              orientation="vertical"
              key={`pair-${index}`}
            >
              <DroppableArea
                id={`slot-${firstItemIndex}`}
                className="pairs-grid__slot"
              >
                {firstItem && selectedFirstItem ? (
                  <DraggableItem
                    id={firstItem}
                    disabled={disabled}
                    onClick={() => removeItem(firstItem)}
                    wrapperClassName={getAnimationClass('bounceIn')}
                    dragStyle={{ cursor: 'grabbing' }}
                    options={{
                      dragOpacity: 0.8,
                      dragScale: 1.05,
                      withTransition: true,
                    }}
                    style={{
                      cursor: 'grab',
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      boxShadow: 'none',
                      touchAction: 'none',
                    }}
                  >
                    <ItemEntry
                      itemEntry={selectedFirstItem}
                      size={pairsCount > 4 ? 'small' : undefined}
                    />
                  </DraggableItem>
                ) : (
                  <ItemEntry
                    itemEntry={placeholder}
                    className="pairs-grid__empty-slot"
                    size={pairsCount > 4 ? 'small' : undefined}
                  />
                )}
              </DroppableArea>
              <DroppableArea
                id={`slot-${secondItemIndex}`}
                className="pairs-grid__slot"
              >
                {secondItem && selectedSecondItem ? (
                  <DraggableItem
                    id={secondItem}
                    disabled={disabled}
                    onClick={() => removeItem(secondItem)}
                    wrapperClassName={getAnimationClass('bounceIn')}
                    dragStyle={{ cursor: 'grabbing' }}
                    options={{
                      dragOpacity: 0.8,
                      dragScale: 1.05,
                      withTransition: true,
                    }}
                    style={{
                      cursor: 'grab',
                      padding: 0,
                      border: 'none',
                      background: 'transparent',
                      boxShadow: 'none',
                      touchAction: 'none',
                    }}
                  >
                    <ItemEntry
                      itemEntry={selectedSecondItem}
                      size={pairsCount > 4 ? 'small' : undefined}
                    />
                  </DraggableItem>
                ) : (
                  <ItemEntry
                    itemEntry={placeholder}
                    className="pairs-grid__empty-slot"
                    size={pairsCount > 4 ? 'small' : undefined}
                  />
                )}
              </DroppableArea>
            </Space>
          );
        })}
      </Space>

      <Space
        wrap
        className={clsx('options-grid', `options-grid--${pool.length}`)}
      >
        {pool.map((entry) => {
          const selected = pairs.includes(entry.id);
          if (selected) {
            return (
              <ItemEntry
                itemEntry={entry}
                key={entry.id}
                className="options-grid--selected"
              />
            );
          }
          return (
            <DraggableItem
              id={entry.id}
              key={entry.id}
              disabled={disabled}
              onClick={() => handleItemClick(entry.id)}
              options={{
                dragOpacity: 0.8,
                dragScale: 1.05,
                withTransition: true,
              }}
              style={{
                cursor: 'grab',
                padding: 0,
                border: 'none',
                background: 'transparent',
                boxShadow: 'none',
                touchAction: 'none',
              }}
            >
              <ItemEntry
                itemEntry={entry}
                looseItem
              />
            </DraggableItem>
          );
        })}
      </Space>
    </DndContext>
  );
}
