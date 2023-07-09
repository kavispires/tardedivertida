import { useState } from 'react';
// Ant Design Resources
import { Button, Space, Tooltip } from 'antd';
// Hooks
import { useLoading } from 'hooks/useLoading';
// Utils
import { getAnimationClass, getColorFromLetter } from 'utils/helpers';
import { LETTERS } from 'utils/constants';
// Components
import { TransparentButton } from 'components/buttons';
import { Card } from 'components/cards';
import { TreeCard } from 'components/cards/TreeCard';
import { Translate } from 'components/language';
import { NoIcon } from 'icons/NoIcon';
import { IconAvatar } from 'components/avatars';
import { LocationIcon } from 'icons/LocationIcon';

type MapBuilderProps = {
  forest: Tree[];
  user: GamePlayer;
  onSubmitMap: GenericFunction;
};

export function MapBuilder({ user, forest, onSubmitMap }: MapBuilderProps) {
  const { isLoading } = useLoading();
  const map: MapSegment[] = (user?.map ?? []).filter((segment: MapSegment) => !segment.passed);
  const previousSelections = map.map((segment) => segment.clues);
  const [selections, setSelections] = useState<(ExtendedTextCard | null)[]>(map.map((_) => null));
  const [currentIndex, setIndex] = useState(0);

  const onSetCard = (card: ExtendedTextCard) => {
    setSelections((prev) => {
      const copy = [...prev];
      copy[currentIndex] = { ...card };
      return copy;
    });
    setIndex((prev) => prev + 1);
  };

  const onSkipTree = () => {
    setSelections((prev) => {
      const copy = [...prev];
      copy[currentIndex] = null;
      return copy;
    });
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
    setIndex(index);
  };

  const onNegateCard = (index: number) => {
    setSelections((prev) => {
      const copy = [...prev];
      if (copy[index]) {
        copy[index]!.negate = !copy[index]?.negate;
      }
      return copy;
    });
  };

  const usedCards = selections.map((card) => card?.id).filter(Boolean);

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
            <div className="map-builder__segment">
              {currentIndex === index && (
                <div className="map-builder__caret">
                  <IconAvatar
                    icon={<LocationIcon />}
                    className={getAnimationClass('bounce', undefined, 'slow', true)}
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
                      <IconAvatar icon={<NoIcon />} size="small" className="map-builder__card-no" />
                    )}
                    {selections?.[index]?.text}
                  </TransparentButton>
                </Tooltip>
              )}

              {(previousSelections?.[index] ?? []).map((card) => {
                return (
                  <div className="map-builder__card">
                    {card?.negate && (
                      <IconAvatar icon={<NoIcon />} size="small" className="map-builder__card-no" />
                    )}
                    {card.text}
                  </div>
                );
              })}

              <TransparentButton onClick={() => onUnsetCard(index)} disabled={!selections?.[index]}>
                <TreeCard id={String(tree.treeType)} text={tree.card.text} />
              </TransparentButton>
            </div>
          );
        })}
      </Space>

      <Space className="space-container" wrap>
        {(user.hand ?? []).map((card: ExtendedTextCard, index: number) => (
          <TransparentButton
            onClick={() => onSetCard(card)}
            key={card.id}
            disabled={usedCards.includes(card.id)}
            className="map-builder__card-button"
          >
            <Card header={LETTERS[index]} color={getColorFromLetter(LETTERS[index])}>
              {card.text}
            </Card>
          </TransparentButton>
        ))}
        <Button
          size="large"
          type="default"
          onClick={() => onSkipTree()}
          disabled={!previousSelections?.[currentIndex]?.length}
        >
          <Translate pt="Pular árvore" en="Skip tree" />
        </Button>
      </Space>

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
