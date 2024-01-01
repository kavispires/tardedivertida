import clsx from 'clsx';
// Ant Design Resources
import { Badge, Space } from 'antd';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
// Types
import type { Item } from '../utils/types';
// Components
import { ItemCard } from 'components/cards/ItemCard';
import { Translate } from 'components/language';
import { Title } from 'components/text';
import { ObjectsKey } from './ObjectsKey';

type ObjectsGridProps = {
  items: Item[];
  showTypes?: boolean;
  activeObjects?: CardId[];
  showAll?: boolean;
};

export function ObjectsGrid({ items, showTypes = false, activeObjects, showAll }: ObjectsGridProps) {
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
              <ItemCard id={`${item.id}`} className={clsx(item.offered && 'objects-grid__item-offered')} />
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

      <ObjectsKey />
    </Space>
  );
}
