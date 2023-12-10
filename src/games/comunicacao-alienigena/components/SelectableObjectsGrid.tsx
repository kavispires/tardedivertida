import clsx from 'clsx';
// Ant Design Resources
import { Badge, Space } from 'antd';
// Hook
import { useLoading } from 'hooks/useLoading';
// Components
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { ObjectsKey } from './ObjectsKey';

type SelectableObjectsGridProps = {
  user: GamePlayer;
  items: Item[];
  selectedObjects: BooleanDictionary;
  selectObject: GenericFunction;
  maxObjects?: number;
  hideKey?: boolean;
  showTypes?: boolean;
};

export function SelectableObjectsGrid({
  items,
  selectedObjects,
  selectObject,
  user,
  maxObjects = 5,
  hideKey = false,
  showTypes = false,
}: SelectableObjectsGridProps) {
  const { isLoading } = useLoading();

  return (
    <Space direction="vertical">
      <Title level={3} size="xx-small" white>
        <Translate pt="Itens" en="Items" />
      </Title>
      <div className="objects-grid">
        {items.map((item) =>
          Boolean(item.offered) ? (
            <div
              className={clsx('objects-grid__button', `objects-grid__item--${item.type}`)}
              key={`selectable-${item.id}`}
            >
              <div className={`objects-grid__item-back objects-grid__item-back--${item.type}`}></div>
            </div>
          ) : (
            <TransparentButton
              key={`selectable-${item.id}`}
              className={clsx('objects-grid__button', showTypes && `objects-grid__button--${item.type}`)}
              disabled={
                item.offered ||
                (!selectedObjects[item.id] && Object.keys(selectedObjects).length === maxObjects) ||
                isLoading ||
                user.ready
              }
              active={selectedObjects[item.id]}
              activeClass={'objects-grid__button--active'}
              onClick={() => selectObject(item.id)}
            >
              <Badge size="small" count={item.inquired} color="orange">
                <ItemCard id={`${item.id}`} className={clsx(item.offered && 'objects-grid__item-offered')} />
              </Badge>
            </TransparentButton>
          )
        )}
      </div>

      {!hideKey && <ObjectsKey />}
    </Space>
  );
}
