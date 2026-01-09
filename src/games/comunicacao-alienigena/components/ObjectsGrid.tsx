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
import type { OfferingsStatus, PhaseBasicState } from '../utils/types';
import { BADGE_INSTRUCTION } from '../utils/constants';
import { useSpriteWidth } from '../utils/useSpriteWidth';
import { ObjectsKey } from './ObjectsKey';

type ObjectsGridProps = {
  items: PhaseBasicState['items'];
  showTypes?: boolean;
  activeObjects?: CardId[];
  showAll?: boolean;
  status: OfferingsStatus;
};

export function ObjectsGrid({ items, showTypes = false, activeObjects, showAll, status }: ObjectsGridProps) {
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
        {items.map((item) => (
          <div
            key={`objects-grid-${item.id}`}
            className={clsx(
              'objects-grid__item',
              (showTypes || item.offerings.length > 0) && `objects-grid__item--${item.type}`,
              activeObjects?.includes(item.id) && 'objects-grid__item--ask',
            )}
          >
            <Badge
              count={item.inquiries}
              color="orange"
              title={dualTranslate(BADGE_INSTRUCTION)}
            >
              <ItemCard
                itemId={`${item.id}`}
                className={clsx(item.offerings.length > 0 && 'objects-grid__item-offered')}
                title={item.name ? dualTranslate(item.name) : undefined}
                width={width}
              />
            </Badge>

            {showAll && Boolean(item.offerings.length > 0) && item.type === 'ITEM' && (
              <span className="objects-grid__offered-icon objects-grid__offered-icon--correct">
                <CheckCircleFilled />
              </span>
            )}
            {showAll && Boolean(item.offerings.length > 0) && item.type !== 'ITEM' && (
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
