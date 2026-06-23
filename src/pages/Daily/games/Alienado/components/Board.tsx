import { useDraggable, useDroppable } from '@dnd-kit/core';
import clsx from 'clsx';
import { motion } from 'motion/react';
// Ant Design Resources
import { Avatar, Button, Flex, Space, Typography } from 'antd';
// Utils
import { getAnimationClass } from '@utils/helpers';
// Components
import { TransparentButton } from '@components/buttons/TransparentButton';
import { SignCard } from '@components/cards/SignCard';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
// Pages
import { DailyItem } from '@pages/Daily/components/DailyItem';
import { Region } from '@pages/Daily/components/Region';
// Internal
import type { DailyAlienadoEntry } from '../utils/types';

type DraggableItemProps = {
  itemId: string;
  source: 'pool' | 'slot';
  index?: number;
  disabled: boolean;
  isComplete: boolean;
  isLose: boolean;
  width: number;
  onClick: (itemId: string) => void;
};

function DraggableItem({
  itemId,
  source,
  index,
  disabled,
  isComplete,
  isLose,
  width,
  onClick,
}: DraggableItemProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: source === 'pool' ? `pool-${itemId}` : `slot-${index}-${itemId}`,
    data: { itemId, source, index },
    disabled: disabled || isComplete,
  });

  return (
    <motion.div
      ref={setNodeRef}
      layout={!isDragging}
      {...listeners}
      {...attributes}
      whileTap={!(disabled || isComplete) ? { scale: 1.1, rotate: 15 } : undefined}
      animate={{
        x: transform ? transform.x : 0,
        y: transform ? transform.y : 0,
        opacity: isDragging ? 0.85 : 1,
      }}
      transition={
        isDragging ? { type: 'tween', duration: 0 } : { type: 'spring', stiffness: 400, damping: 25 }
      }
      style={{
        zIndex: isDragging ? 50 : 1,
        cursor: disabled || isComplete ? 'not-allowed' : isDragging ? 'grabbing' : 'pointer',
        touchAction: 'none',
      }}
    >
      <TransparentButton
        onClick={() => onClick(itemId)}
        disabled={disabled || isComplete}
        className={source === 'pool' ? 'alien-items__item-button' : 'mt-1'}
      >
        <DailyItem
          itemId={itemId}
          width={source === 'slot' && isLose ? width / 2 : width}
          padding={source === 'pool' ? 1 : 0}
        />
      </TransparentButton>
    </motion.div>
  );
}

type DroppableSlotProps = {
  index: number;
  selectedItemId: string | null;
  slotIndex: number | null;
  isComplete: boolean;
  isLose: boolean;
  width: number;
  onSlotClick: (index: number) => void;
  onItemClick: (itemId: string) => void;
};

function DroppableSlot({
  index,
  selectedItemId,
  slotIndex,
  isComplete,
  isLose,
  width,
  onSlotClick,
  onItemClick,
}: DroppableSlotProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `slot-${index}`,
    data: { index },
    disabled: isComplete,
  });

  const isReceiving = isOver && !isComplete;

  return (
    <div
      ref={setNodeRef}
      className={clsx(isReceiving && selectedItemId && 'alien-request__slot--active')}
      style={{ borderRadius: 8 }}
    >
      {selectedItemId ? (
        <DraggableItem
          itemId={selectedItemId}
          source="slot"
          index={index}
          disabled={false}
          isComplete={isComplete}
          isLose={isLose}
          width={width}
          onClick={onItemClick}
        />
      ) : (
        <TransparentButton
          onClick={() => onSlotClick(index)}
          className="mt-3"
          disabled={isComplete}
          active={slotIndex === index || isReceiving}
          activeClass="alien-request__slot--active"
        >
          <Avatar
            shape="square"
            size="large"
          >
            ?
          </Avatar>
        </TransparentButton>
      )}
    </div>
  );
}

type BoardProps = {
  latestAttempt: number | null;
  shouldShakeScreen: boolean;
  selection: (string | null)[];
  onItemClick: (itemId: string) => void;
  onSlotClick: (index: number) => void;
  slotIndex: number | null;
  isComplete: boolean;
  isLose: boolean;
  width: number;
  data: DailyAlienadoEntry;
  previousGuesses: string[][];
  isReady: boolean;
  submitGuess: () => void;
};

export function Board({
  latestAttempt,
  shouldShakeScreen,
  data,
  selection,
  onItemClick,
  onSlotClick,
  slotIndex,
  isComplete,
  isLose,
  width,
  previousGuesses,
  isReady,
  submitGuess,
}: BoardProps) {
  return (
    <>
      <Region
        key={latestAttempt}
        className={shouldShakeScreen ? getAnimationClass('shakeX') : ''}
      >
        <Typography.Text strong>
          <Translate
            pt="O alienígena quer isso:"
            en="The alien wants these:"
          />
        </Typography.Text>

        <Flex
          className="alien-requests"
          gap={8}
        >
          {data.requests.map((request, index) => {
            const selected = selection[index];
            return (
              <Flex
                vertical
                className="alien-requests__request"
                key={request.itemId}
                align="center"
                justify="flex-start"
              >
                <Avatar className="mb-2">{index + 1}</Avatar>
                <Flex
                  vertical
                  className="alien-requests__attributes"
                  align="center"
                >
                  <SignCard
                    signId={request.spritesIds[2]}
                    width={width - 12}
                    className="alien-requests__sign"
                  />
                  <SignCard
                    signId={request.spritesIds[1]}
                    width={width - 12}
                    className="alien-requests__sign"
                  />
                  <SignCard
                    signId={request.spritesIds[0]}
                    width={width - 12}
                    className="alien-requests__sign"
                  />
                </Flex>

                <DroppableSlot
                  index={index}
                  selectedItemId={selected}
                  slotIndex={slotIndex}
                  isComplete={isComplete}
                  isLose={isLose}
                  width={width}
                  onSlotClick={onSlotClick}
                  onItemClick={onItemClick}
                />

                {isComplete && (
                  <DailyItem
                    itemId={request.itemId}
                    width={width}
                    padding={6}
                    className={clsx('alien-request__answer mt-2', getAnimationClass('zoomIn'))}
                  />
                )}
              </Flex>
            );
          })}
        </Flex>

        {isComplete && (
          <SpaceContainer orientation="vertical">
            {previousGuesses.map((guess) => (
              <Space key={String(guess)}>
                {guess.map((itemId) => (
                  <DailyItem
                    key={itemId}
                    itemId={itemId}
                    width={Math.max(width / 2, 40)}
                    padding={3}
                    className="alien-requests__previous-item mx-2"
                  />
                ))}
              </Space>
            ))}
          </SpaceContainer>
        )}

        {isReady && !isComplete && (
          <Region>
            <Button
              type="primary"
              onClick={submitGuess}
            >
              <Translate
                pt="Enviar"
                en="Submit"
              />
            </Button>
          </Region>
        )}
      </Region>

      <Region>
        <Typography.Text strong>
          <Translate
            pt="E essas são as coisas disponíveis:"
            en="And these are the available things:"
          />
        </Typography.Text>

        <SpaceContainer wrap>
          {data.itemsIds.map((itemId) => {
            const isDisabled = isComplete || isReady || selection.includes(itemId);
            return (
              <DraggableItem
                key={itemId}
                itemId={itemId}
                source="pool"
                disabled={isDisabled}
                isComplete={isComplete}
                isLose={isLose}
                width={width}
                onClick={onItemClick}
              />
            );
          })}
        </SpaceContainer>
      </Region>
    </>
  );
}
