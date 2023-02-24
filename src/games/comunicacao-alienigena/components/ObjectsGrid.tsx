import clsx from 'clsx';
// Ant Design Resources
import { Space } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';

type ObjectsGridProps = {
  items: Item[];
  showTypes?: boolean;
  activeObjects?: CardId[];
  showAll?: boolean;
};

export function ObjectsGrid({ items, showTypes = false, activeObjects, showAll }: ObjectsGridProps) {
  return (
    <Space direction="vertical">
      <div className="objects-grid">
        {items.map((item) => (
          <div
            key={`objects-grid-${item.id}`}
            className={clsx(
              'objects-grid__item',
              (showTypes || item.offered) && `objects-grid__item--${item.type}`,

              activeObjects?.includes(item.id) && `objects-grid__item--ask`
            )}
          >
            {!showAll && Boolean(item.offered) ? (
              <div className={`objects-grid__item-back objects-grid__item-back--${item.type}`}></div>
            ) : (
              <ItemCard id={`${item.id}`} className={clsx(item.offered && 'objects-grid__item-offered')} />
            )}
            {showAll && Boolean(item.offered) && item.type === 'ITEM' && (
              <span className="objects-grid__offered-icon objects-grid__offered-icon--correct">
                <CheckCircleFilled />
              </span>
            )}
            {showAll && Boolean(item.offered) && item.type !== 'ITEM' && (
              <span className="objects-grid__offered-icon objects-grid__offered-icon--incorrect">
                <CloseCircleFilled />
              </span>
            )}
          </div>
        ))}
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
