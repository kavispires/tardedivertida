import clsx from 'clsx';
// Ant Design Resources
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Badge, Space } from 'antd';
// Hooks
import { useLanguage } from 'hooks/useLanguage';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { Title } from 'components/text';
// Internal
import type { Item, OfferingsStatus } from '../utils/types';
import { ObjectsKey } from './ObjectsKey';

type ObjectsGridProps = {
  items: Item[];
  showTypes?: boolean;
  activeObjects?: CardId[];
  showAll?: boolean;
  status: OfferingsStatus;
};

export function ObjectsGrid({ items, showTypes = false, activeObjects, showAll, status }: ObjectsGridProps) {
  const { dualTranslate } = useLanguage();
  return (
    <Space direction="vertical">
      <Title level={3} size="xx-small" white>
        <Translate pt="Itens" en="Items" />
      </Title>
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
            <Badge size="small" count={item.inquired} color="orange">
              <ItemCard
                id={`${item.id}`}
                className={clsx(item.offered && 'objects-grid__item-offered')}
                title={item.name ? dualTranslate(item.name) : undefined}
              />
            </Badge>

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

      <ObjectsKey status={status} />
    </Space>
  );
}
