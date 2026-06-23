import { cloneDeep } from 'lodash';
import { motion } from 'motion/react';
import { useState } from 'react';
// Ant Design Resources
import { DoubleRightOutlined } from '@ant-design/icons';
import { Alert, Button, Checkbox, Flex, Popconfirm, Tooltip } from 'antd';
// Types
import type { GamePlayer } from 'types/game';
// Utils
import { getAnimation } from '@utils/animations';
// Icons
import { LocationIcon } from '@icons/LocationIcon';
import { NoIcon } from '@icons/NoIcon';
// Components
import { SendButton } from '@components/buttons/SendButton';
import { TransparentButton } from '@components/buttons/TransparentButton';
import { TextCard } from '@components/cards/TextCard';
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
import { SpaceContainer } from '@components/layout/SpaceContainer';
import { SpaceFloat } from '@components/layout/SpaceFloat';
import { TitledContainer } from '@components/layout/TitledContainer';
import { RuleInstruction } from '@components/text/RuleInstruction';
import { TextHighlight } from '@components/text/TextHighlight';
// Internal
import type {
  CustomPlayerProps,
  ExtendedTextCard,
  MapSegment,
  OnSubmitMapFunction,
  Tree,
} from '../utils/types';
import { getPossibleTreeIds } from '../utils/helpers';
import { TreeImage } from './TreeImage';

const MotionIconAvatar = motion.create(Icon);
const MotionTextHighlight = motion.create(TextHighlight);

type MapBuilderProps = {
  forest: Tree[];
  user: GamePlayer<CustomPlayerProps>;
  onSubmitMap: OnSubmitMapFunction;
};

export function MapBuilder({ user, forest, onSubmitMap }: MapBuilderProps) {
  const userMap = user?.map ?? [];
  const map: MapSegment[] = userMap.filter((segment: MapSegment) => !segment.passed);
  const previousSelections = map.map((segment) => segment.clues);
  const [selections, setSelections] = useState<(ExtendedTextCard | null)[]>(map.map((_) => null));
  const [currentIndex, setIndex] = useState(0);
  const [skippedIndexes, setSkippedIndexes] = useState<number[]>([]);
  const [mulliganUsed, setMulliganUsed] = useState(false);

  const onSetCard = (card: ExtendedTextCard) => {
    setSelections((prev) => {
      const copy = [...prev];
      copy[currentIndex] = { ...card };
      return copy;
    });
    setIndex((prev) => prev + 1);
  };

  const onSkipTree = (index: number) => {
    setSelections((prev) => {
      const copy = [...prev];
      copy[currentIndex] = null;
      return copy;
    });
    setSkippedIndexes((prev) => [...prev, index]);
    setIndex((prev) => prev + 1);
  };

  const onUnsetCard = (index: number) => {
    setSelections((prev) => {
      const copy = [...prev].map((card, idx) => {
        if (idx < index) return card;

        return null;
      });
      return copy;
    });
    setSkippedIndexes((prev) => prev.filter((v) => v !== index));
    setIndex(index);
  };

  const onNegateCard = (index: number) => {
    setSelections((prev) => {
      const copy = cloneDeep(prev);
      if (copy[index]) {
        if (copy[index]?.negate === undefined) {
          copy[index].negate = true;
        } else {
          copy[index].negate = !copy[index].negate;
        }
      }
      return copy;
    });
  };

  const usedCards = selections.map((card) => card?.id).filter(Boolean);

  const possibleTreeIds = getPossibleTreeIds(userMap, map?.[currentIndex]);

  return (
    <>
      <SpaceContainer
        className="map-builder"
        wrap
      >
        {map.map((segment, index) => {
          if (segment.passed) {
            return null;
          }

          const tree = forest[segment.treeId];

          if (!tree) {
            return null;
          }

          return (
            <div
              className="map-builder__segment"
              key={`map-segment-${segment.index}`}
            >
              {currentIndex === index && (
                <div className="map-builder__caret">
                  <MotionIconAvatar
                    icon={<LocationIcon />}
                    size="small"
                    {...getAnimation('bounce', { speed: 'slow', infinite: true })}
                  />
                </div>
              )}

              {Boolean(selections[index]) && (
                <Tooltip
                  title={
                    <Translate
                      pt={`Clique para negar: Não-${selections?.[index]?.text}`}
                      en={`Click to negate: Non-${selections?.[index]?.text}`}
                    />
                  }
                >
                  <TransparentButton
                    onClick={() => onNegateCard(index)}
                    disabled={!selections?.[index]}
                    className="map-builder__card map-builder__card--new"
                  >
                    {selections?.[index]?.negate && (
                      <Icon
                        icon={<NoIcon />}
                        size="small"
                        className="map-builder__card-no"
                      />
                    )}
                    {selections?.[index]?.text}
                  </TransparentButton>
                </Tooltip>
              )}

              {(previousSelections?.[index] ?? []).map((card) => {
                return (
                  <div
                    className="map-builder__card"
                    key={card.id}
                  >
                    {card?.negate && (
                      <Icon
                        icon={<NoIcon />}
                        size="small"
                        className="map-builder__card-no"
                      />
                    )}
                    {card.text}
                  </div>
                );
              })}

              <TransparentButton
                onClick={() => onUnsetCard(index)}
                disabled={!(selections?.[index] || skippedIndexes.includes(index))}
              >
                <TreeImage
                  id={tree.treeType}
                  text={tree.card.text}
                />
              </TransparentButton>
            </div>
          );
        })}
      </SpaceContainer>

      {possibleTreeIds.length > 0 && (
        <RuleInstruction type="tip">
          <strong>
            <Translate
              pt="Caminhos possíveis para a árvore atual"
              en="Possible paths for the current tree"
            />
            :
          </strong>
          {possibleTreeIds.map((treeId, index) => (
            <MotionTextHighlight
              key={`highlighted-possibility-${treeId}`}
              {...getAnimation('tada', { delay: 3 + 0.5 * index })}
            >
              {forest?.[treeId]?.card?.text}
            </MotionTextHighlight>
          ))}
        </RuleInstruction>
      )}

      <TitledContainer
        title={
          <Translate
            pt="Cartas"
            en="Hand"
          />
        }
        contained
      >
        {user.mulliganReceived && (
          <Alert
            showIcon
            title={
              <Translate
                pt="Você escolheu trocar a mão de cartas na rodada anterior, aqui estão suas novas cartas!"
                en="You chose to mulligan your hand in the previous round, here are your new cards!"
              />
            }
            type="warning"
          />
        )}

        <Flex
          wrap
          justify="center"
        >
          {(user.hand ?? []).map((card: ExtendedTextCard) => (
            <TransparentButton
              onClick={() => onSetCard(card)}
              key={card.id}
              disabled={usedCards.includes(card.id) || currentIndex >= map.length}
              className="map-builder__card-button"
            >
              <TextCard>{card.text}</TextCard>
            </TransparentButton>
          ))}
        </Flex>
        <Button
          size="large"
          type="default"
          onClick={() => onSkipTree(currentIndex)}
          disabled={!previousSelections?.[currentIndex]?.length}
          icon={<DoubleRightOutlined />}
          iconPlacement="end"
        >
          <Translate
            pt="Pular árvore"
            en="Skip tree"
          />
        </Button>
      </TitledContainer>

      <SpaceFloat enabled={usedCards.length > 0}>
        {user.mulliganAvailable && (
          <Popconfirm
            title={
              <Translate
                pt="Descartar Mão e Pegar Novas Cartas?"
                en="Discard Hand and Draw New Cards?"
              />
            }
            description={
              <Translate
                pt="Você pode fazer isso apenas uma vez por jogo. Você perderá todas as suas cartas e receberá cartas novas."
                en="You can only do this once per game. You will lose all your cards and get cartas new ones."
              />
            }
            onConfirm={() => setMulliganUsed(true)}
            onCancel={() => setMulliganUsed(false)}
            okText={
              <Translate
                pt="Sim, pegar novas cartas"
                en="Yes, get new cards"
              />
            }
            cancelText={
              <Translate
                pt="Cancelar"
                en="Cancel"
              />
            }
          >
            <Checkbox checked={mulliganUsed}>
              <Translate
                pt="Descartar mão e pegar novas cartas"
                en="Discard hand and get new cards"
              />
            </Checkbox>
          </Popconfirm>
        )}

        <SendButton
          size="large"
          disabled={usedCards.length === 0}
          onClick={() => onSubmitMap({ newMap: selections, mulligan: mulliganUsed })}
        >
          <Translate
            pt="Enviar Mapa"
            en="Submit Map"
          />
        </SendButton>
      </SpaceFloat>
    </>
  );
}
