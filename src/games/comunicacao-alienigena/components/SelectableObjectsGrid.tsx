import { Space } from 'antd';
import clsx from 'clsx';
import { TransparentButton } from 'components/buttons';
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { useLoading } from 'hooks/useLoading';

type SelectableObjectsGridProps = {
  user: GamePlayer;
  items: Item[];
  selectedObjects: BooleanDictionary;
  selectObject: GenericFunction;
  maxObjects?: number;
};

export function SelectableObjectsGrid({
  items,
  selectedObjects,
  selectObject,
  user,
  maxObjects = 5,
}: SelectableObjectsGridProps) {
  const { isLoading } = useLoading();

  return (
    <Space direction="vertical">
      <div className="objects-grid">
        {items.map((item) =>
          Boolean(item.offered) ? (
            <div className={clsx('objects-grid__button', item.offered && `objects-grid__item--${item.type}`)}>
              <div className={`objects-grid__item-back objects-grid__item-back--${item.type}`}></div>
            </div>
          ) : (
            <TransparentButton
              className={clsx('objects-grid__button', item.offered && `objects-grid__item--${item.type}`)}
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
              <ItemCard id={`${item.id}`} className={clsx(item.offered && 'objects-grid__item-offered')} />
            </TransparentButton>
          )
        )}
      </div>

      <div className="objects-key">
        <div className="objects-key__entry">
          <span className="objects-key__example objects-key__example--UNKNOWN"></span>
          <span className="objects-key__text">
            <Translate pt="Desconhecido" en="Unknown" />
          </span>
        </div>
        <div className="objects-key__entry">
          <span className="objects-key__example objects-key__example--ITEM"></span>
          <span className="objects-key__text">
            <Translate pt="Quer" en="Want" />
          </span>
        </div>
        <div className="objects-key__entry">
          <span className="objects-key__example objects-key__example--CURSE"></span>
          <span className="objects-key__text">
            <Translate pt="Amaldiçoado" en="Cursed" />
          </span>
        </div>
        <div className="objects-key__entry">
          <span className="objects-key__example objects-key__example--BLANK"></span>
          <span className="objects-key__text">
            <Translate pt="Alienígena não quis" en="Alien did not want it" />
          </span>
        </div>
      </div>
    </Space>
  );
}
