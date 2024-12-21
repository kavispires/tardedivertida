import { useState } from "react";
// Ant Design Resources
import { Button, Space, Tooltip } from "antd";
// Types
import type { GamePlayer } from "types/player";
// Hooks
import { useLoading } from "hooks/useLoading";
// Utils
import { getAnimationClass } from "utils/helpers";
// Icons
import { LocationIcon } from "icons/LocationIcon";
import { NoIcon } from "icons/NoIcon";
// Components
import { IconAvatar } from "components/avatars";
import { TransparentButton } from "components/buttons";
import { Card } from "components/cards";
import { Container } from "components/general/Container";
import { Translate } from "components/language";
import { TextHighlight } from "components/text";
// Internal
import type {
  ExtendedTextCard,
  MapSegment,
  OnSubmitMapFunction,
  Tree,
} from "../utils/types";
import { getPossibleTreeIds } from "../utils/helpers";
import { TreeImage } from "./TreeImage";

type MapBuilderProps = {
  forest: Tree[];
  user: GamePlayer;
  onSubmitMap: OnSubmitMapFunction;
};

export function MapBuilder({ user, forest, onSubmitMap }: MapBuilderProps) {
  const { isLoading } = useLoading();
  const userMap = user?.map ?? [];
  const map: MapSegment[] = userMap.filter(
    (segment: MapSegment) => !segment.passed,
  );
  const previousSelections = map.map((segment) => segment.clues);
  const [selections, setSelections] = useState<(ExtendedTextCard | null)[]>(
    map.map((_) => null),
  );
  const [currentIndex, setIndex] = useState(0);
  const [skippedIndexes, setSkippedIndexes] = useState<number[]>([]);

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
      const copy = [...(prev ?? [])];
      if (copy[index]) {
        // biome-ignore lint/style/noNonNullAssertion: idk what's up with the compiler
        copy[index]!.negate = !copy[index]?.negate;
      }
      return copy;
    });
  };

  const usedCards = selections.map((card) => card?.id).filter(Boolean);

  const possibleTreeIds = getPossibleTreeIds(userMap, map?.[currentIndex]);

  return (
    <>
      <Space className="space-container map-builder" wrap>
        {map.map((segment, index) => {
          if (segment.passed) {
            return <></>;
          }

          const tree = forest[segment.treeId];

          if (!tree) {
            return <></>;
          }

          return (
            <div
              className="map-builder__segment"
              key={`map-segment-${segment.index}`}
            >
              {currentIndex === index && (
                <div className="map-builder__caret">
                  <IconAvatar
                    icon={<LocationIcon />}
                    className={getAnimationClass("bounce", {
                      speed: "slow",
                      infinite: true,
                    })}
                    size="small"
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
                      <IconAvatar
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
                  <div className="map-builder__card" key={card.id}>
                    {card?.negate && (
                      <IconAvatar
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
                disabled={
                  !(selections?.[index] || skippedIndexes.includes(index))
                }
              >
                <TreeImage id={tree.treeType} text={tree.card.text} />
              </TransparentButton>
            </div>
          );
        })}
      </Space>

      {possibleTreeIds.length > 0 && (
        <Space className="contained" wrap>
          <strong>
            <Translate
              pt="Caminhos possíveis para a árvore atual"
              en="Possible paths for the current tree"
            />
            :
          </strong>
          {possibleTreeIds.map((treeId, index) => (
            <TextHighlight
              key={`highlighted-possibility-${treeId}`}
              className={getAnimationClass("tada", { delay: index })}
            >
              {forest?.[treeId]?.card?.text}
            </TextHighlight>
          ))}
        </Space>
      )}

      <Container title={<Translate pt="Cartas" en="Hand" />} contained>
        {(user.hand ?? []).map((card: ExtendedTextCard, index: number) => (
          <TransparentButton
            onClick={() => onSetCard(card)}
            key={card.id}
            disabled={usedCards.includes(card.id) || currentIndex >= map.length}
            className="map-builder__card-button"
          >
            <Card hideHeader>{card.text}</Card>
          </TransparentButton>
        ))}
        <Button
          size="large"
          type="default"
          onClick={() => onSkipTree(currentIndex)}
          disabled={!previousSelections?.[currentIndex]?.length}
        >
          <Translate pt="Pular árvore" en="Skip tree" />
        </Button>
      </Container>

      <Space className="space-container">
        <Button
          type="primary"
          size="large"
          disabled={isLoading || usedCards.length === 0}
          onClick={() => onSubmitMap({ newMap: selections })}
        >
          <Translate pt="Enviar Mapa" en="Submit Map" />
        </Button>
      </Space>
    </>
  );
}
