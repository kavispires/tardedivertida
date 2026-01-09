import clsx from 'clsx';
// Ant Design Resources
import { Badge, Space } from 'antd';
// Types
import type { GamePlayer } from 'types/player';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
import { useLoading } from 'hooks/useLoading';
// Components
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { OfferingsStatus, PhaseBasicState } from '../utils/types';
import { BADGE_INSTRUCTION } from '../utils/constants';
import { useSpriteWidth } from '../utils/useSpriteWidth';
import { ObjectsKey } from './ObjectsKey';
// Hook

type SelectableObjectsGridProps = {
  user: GamePlayer;
  items: PhaseBasicState['items'];
  selectedObjects: BooleanDictionary;
  selectObject: (id: string) => void;
  maxObjects?: number;
  hideKey?: boolean;
  showTypes?: boolean;
  isAlienRequest?: boolean;
  status: OfferingsStatus;
};

export function SelectableObjectsGrid({
  items,
  selectedObjects,
  selectObject,
  user,
  maxObjects = 5,
  hideKey = false,
  showTypes = false,
  isAlienRequest = false,
  status,
}: SelectableObjectsGridProps) {
  const { isLoading } = useLoading();
  const { dualTranslate } = useLanguage();
  const width = useSpriteWidth();

  return (
    <Space orientation="vertical">
      <Title
        level={3}
        size="xx-small"
      >
        <Translate
          pt="Itens"
          en="Items"
        />
      </Title>
      <div className="objects-grid">
        {items.map((item) =>
          Boolean(item.offerings.length) || (isAlienRequest && item.type !== 'ITEM') ? (
            <div
              className={clsx('objects-grid__item', `objects-grid__item--${item.type}`)}
              key={`selectable-${item.id}`}
            >
              <Badge
                count={item.inquiries}
                color="orange"
                title={dualTranslate(BADGE_INSTRUCTION)}
              >
                <ItemCard
                  itemId={`${item.id}`}
                  className={clsx(item.offerings.length && 'objects-grid__item-offered')}
                  title={item.name ? dualTranslate(item.name) : undefined}
                  width={width}
                />
              </Badge>
            </div>
          ) : (
            <TransparentButton
              key={`selectable-${item.id}`}
              className={clsx('objects-grid__button', showTypes && `objects-grid__button--${item.type}`)}
              disabled={
                item.offerings.length > 0 ||
                (!selectedObjects[item.id] && Object.keys(selectedObjects).length === maxObjects) ||
                isLoading ||
                user.ready
              }
              active={selectedObjects[item.id]}
              activeClass={'objects-grid__button--active'}
              onClick={() => selectObject(item.id)}
            >
              <Badge
                count={item.inquiries}
                color="orange"
                title={dualTranslate(BADGE_INSTRUCTION)}
              >
                <ItemCard
                  itemId={`${item.id}`}
                  className={clsx(item.offerings.length && 'objects-grid__item-offered')}
                  title={item.name ? dualTranslate(item.name) : undefined}
                  width={width}
                />
              </Badge>
            </TransparentButton>
          ),
        )}
      </div>

      {!hideKey && <ObjectsKey status={status} />}
    </Space>
  );
}
