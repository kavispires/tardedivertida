import clsx from 'clsx';
// Ant Design Resources
import { Avatar, Button, Flex, Space, Typography } from 'antd';
// Utils
import { getAnimationClass } from 'utils/helpers';
// Components
import { TransparentButton } from 'components/buttons/TransparentButton';
import { SignCard } from 'components/cards/SignCard';
import { Translate } from 'components/language/Translate';
import { SpaceContainer } from 'components/layout/SpaceContainer';
// Pages
import { DailyItem } from 'pages/Daily/components/DailyItem';
import { Region } from 'pages/Daily/components/Region';
// Internal
import type { DailyAlienadoEntry } from '../utils/types';

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

                {selected ? (
                  <TransparentButton
                    onClick={() => onItemClick(selected)}
                    className="mt-1"
                    disabled={isComplete}
                  >
                    <DailyItem
                      itemId={selected}
                      width={isLose ? width / 2 : width}
                      padding={0}
                    />
                  </TransparentButton>
                ) : (
                  <TransparentButton
                    onClick={() => onSlotClick(index)}
                    className="mt-3"
                    disabled={isComplete}
                    active={slotIndex === index}
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
          {data.itemsIds.map((itemId) => (
            <TransparentButton
              key={itemId}
              onClick={() => onItemClick(itemId)}
              disabled={isComplete || isReady || selection.includes(itemId)}
              className="alien-items__item-button"
            >
              <DailyItem
                itemId={itemId}
                width={width}
                padding={3}
              />
            </TransparentButton>
          ))}
        </SpaceContainer>
      </Region>
    </>
  );
}
