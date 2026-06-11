import clsx from 'clsx';
import { keyBy } from 'lodash';
import { useMemo } from 'react';
// Ant Design Resources
import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, Flex, Popover, Space, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Hooks
import { useCache } from 'hooks/useCache';
// Components
import { TransparentButton } from 'components/buttons/TransparentButton';
import { SignCard } from 'components/cards/SignCard';
import { DualTranslate } from 'components/language/DualTranslate';
import { Translate } from 'components/language/Translate';
import { Title } from 'components/text/Title';
// Internal
import type { PhaseBasicState } from '../utils/types';
import { SPRITE_SIZE } from '../utils/constants';

type HumanSignBoardProps = {
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
  knownSpriteIds: string[];
};

export function HumanSignBoard({
  attributes,
  startingAttributesIds = [],
  knownSpriteIds,
}: HumanSignBoardProps) {
  const { cache, updateCache } = useCache<Dictionary<string>>({});

  const startingAttributes = useMemo(() => {
    return keyBy(
      attributes.filter((attribute) => startingAttributesIds.includes(attribute.id)),
      'id',
    );
  }, [attributes, startingAttributesIds]);

  const spriteUseCount = useMemo(() => {
    return Object.values(cache).reduce(
      (acc, spriteId) => {
        if (!spriteId) return acc;
        acc[spriteId] = (acc[spriteId] || 0) + 1;
        return acc;
      },
      {} as Dictionary<number>,
    );
  }, [cache]);

  return (
    <Space orientation="vertical">
      <Title
        level={3}
        size="xx-small"
        marginBottom={0}
      >
        <Translate
          pt="Atributos e Símbolos"
          en="Attributes and Symbols"
        />
        <Popover
          content={
            <Translate
              pt="Você pode clicar no título do atributo para apagar o que você desenhou"
              en="You may click on the title of an attribute to erase what you drew"
            />
          }
          title={
            <Translate
              pt="Dica"
              en="Hint"
            />
          }
          arrow
        >
          <Button
            type="text"
            style={{ color: 'white' }}
            icon={<InfoCircleOutlined />}
            shape="circle"
          />
        </Popover>
      </Title>
      <Space
        orientation="vertical"
        className="board-container"
      >
        <div className="attributes-grid">
          {attributes.map((attribute) => {
            if (startingAttributes[attribute.id]) {
              return (
                <div
                  className="attributes-grid__item"
                  key={attribute.id}
                >
                  <Tooltip
                    title={
                      <>
                        <DualTranslate>{attribute.description}</DualTranslate> (
                        <Translate
                          pt="Item inicial"
                          en="Starting item"
                        />
                        )
                      </>
                    }
                    placement="bottom"
                  >
                    <DualTranslate>{attribute.name}</DualTranslate>*
                  </Tooltip>
                  <SignCard
                    signId={`${attribute.spriteId}`}
                    className="transparent"
                    width={SPRITE_SIZE}
                  />
                </div>
              );
            }

            return (
              <div
                className="attributes-grid__item"
                key={attribute.id}
              >
                <Tooltip
                  title={<DualTranslate>{attribute.description}</DualTranslate>}
                  placement="bottom"
                >
                  <TransparentButton>
                    <DualTranslate>{attribute.name}</DualTranslate>
                  </TransparentButton>
                </Tooltip>
                <Popover
                  title={
                    <Translate
                      pt="Selecionar símbolo"
                      en="Select symbol"
                    />
                  }
                  trigger="click"
                  content={
                    <Flex
                      vertical
                      gap={6}
                      style={{ maxWidth: SPRITE_SIZE * 4 }}
                    >
                      <Flex
                        wrap
                        justify="center"
                      >
                        {knownSpriteIds.map((spriteId) => (
                          <TransparentButton
                            key={spriteId}
                            onClick={() => updateCache(attribute.id, spriteId)}
                          >
                            <SignCard
                              signId={`${spriteId}`}
                              width={SPRITE_SIZE / 1.5}
                              className={clsx({
                                'attributes-grid__assigned-sprite': Object.values(cache).includes(spriteId),
                              })}
                            />
                          </TransparentButton>
                        ))}
                      </Flex>
                      <Button
                        size="small"
                        shape="round"
                        onClick={() => updateCache(attribute.id, undefined)}
                      >
                        <Translate
                          pt="Nenhum desses"
                          en="None of these"
                        />
                      </Button>
                    </Flex>
                  }
                >
                  {cache?.[attribute.id] ? (
                    <TransparentButton>
                      <SignCard
                        signId={cache[attribute.id] ?? ''}
                        width={SPRITE_SIZE}
                        className={clsx({
                          'attributes-grid__duplicated-sprite': spriteUseCount[cache[attribute.id]] > 1,
                        })}
                      />
                    </TransparentButton>
                  ) : (
                    <Flex
                      justify="center"
                      align="center"
                      className="italic"
                      style={{
                        opacity: 0.3,
                        width: SPRITE_SIZE,
                        height: SPRITE_SIZE,
                      }}
                    >
                      <Button>?</Button>
                    </Flex>
                  )}
                </Popover>
              </div>
            );
          })}
        </div>
      </Space>
    </Space>
  );
}

type HumanPlayerFinalSignBoardProps = {
  player: GamePlayer;
  attributes: PhaseBasicState['attributes'];
  startingAttributesIds: string[];
};

export function HumanPlayerFinalSignBoard({
  player,
  attributes,
  startingAttributesIds = [],
}: HumanPlayerFinalSignBoardProps) {
  const notes: Dictionary<string> = player.notes || {};

  const startingAttributes = useMemo(() => {
    return keyBy(
      attributes.filter((attribute) => startingAttributesIds.includes(attribute.id)),
      'id',
    );
  }, [attributes, startingAttributesIds]);

  const spriteUseCount = useMemo(() => {
    return Object.values(notes).reduce(
      (acc, spriteId) => {
        if (!spriteId) return acc;
        acc[spriteId] = (acc[spriteId] || 0) + 1;
        return acc;
      },
      {} as Dictionary<number>,
    );
  }, [notes]);

  return (
    <Space orientation="vertical">
      <Space
        orientation="vertical"
        className="board-container"
      >
        <div className="attributes-grid">
          {attributes.map((attribute) => {
            if (startingAttributes[attribute.id]) {
              return (
                <div
                  className="attributes-grid__item"
                  key={attribute.id}
                >
                  <Tooltip
                    title={
                      <>
                        <DualTranslate>{attribute.description}</DualTranslate> (
                        <Translate
                          pt="Item inicial"
                          en="Starting item"
                        />
                        )
                      </>
                    }
                    placement="bottom"
                  >
                    <DualTranslate>{attribute.name}</DualTranslate>*
                  </Tooltip>
                  <SignCard
                    signId={`${attribute.spriteId}`}
                    className="transparent"
                    width={SPRITE_SIZE}
                  />
                </div>
              );
            }

            return (
              <div
                className="attributes-grid__item"
                key={attribute.id}
              >
                <Tooltip
                  title={<DualTranslate>{attribute.description}</DualTranslate>}
                  placement="bottom"
                >
                  <TransparentButton>
                    <DualTranslate>{attribute.name}</DualTranslate>
                  </TransparentButton>
                </Tooltip>

                {notes?.[attribute.id] ? (
                  <SignCard
                    signId={notes[attribute.id] ?? ''}
                    width={SPRITE_SIZE}
                    className={clsx({
                      'attributes-grid__duplicated-sprite': spriteUseCount[notes[attribute.id]] > 1,
                    })}
                  />
                ) : (
                  <Flex
                    justify="center"
                    align="center"
                    className="italic"
                    style={{
                      opacity: 0.3,
                      width: SPRITE_SIZE,
                      height: SPRITE_SIZE,
                    }}
                  >
                    <Button disabled>?</Button>
                  </Flex>
                )}
              </div>
            );
          })}
        </div>
      </Space>
    </Space>
  );
}
