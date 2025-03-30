import clsx from 'clsx';
// Ant Design Resources
import { PlusSquareFilled } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Components
import { CrimeItemCard } from 'components/cards/CrimeItemCard';
// Internal
import type { ItemsDict } from '../utils/types';

type SelectedItemsProps = {
  items: ItemsDict;
  weaponId: string;
  evidenceId: string;
  victimId?: string;
  locationId?: string;
  highlight?: string;
};

export function SelectedItems({
  items,
  weaponId,
  evidenceId,
  victimId,
  locationId,
  highlight,
}: SelectedItemsProps) {
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 50, maxWidth: 200 });

  return (
    <ul className="h-items-crime-selection">
      <li>
        <CrimeItemCard
          item={items[weaponId]}
          cardWidth={cardWidth}
          className={clsx(highlight && highlight !== 'weapon' && 'h-items-crime-selection__faded')}
        />
      </li>
      <li>
        <PlusSquareFilled style={{ color: 'white' }} />
      </li>
      <li>
        <CrimeItemCard
          item={items[evidenceId]}
          cardWidth={cardWidth}
          className={clsx(highlight && highlight !== 'evidence' && 'h-items-crime-selection__faded')}
        />
      </li>
      {victimId && (
        <>
          <li>
            <PlusSquareFilled style={{ color: 'white' }} />
          </li>
          <li>
            <CrimeItemCard
              item={items[victimId]}
              cardWidth={cardWidth}
              className={clsx(highlight && highlight !== 'victim' && 'h-items-crime-selection__faded')}
            />
          </li>
        </>
      )}
      {locationId && (
        <>
          <li>
            <PlusSquareFilled style={{ color: 'white' }} />
          </li>
          <li>
            <CrimeItemCard
              item={items[locationId]}
              cardWidth={cardWidth}
              className={clsx(highlight && highlight !== 'location' && 'h-items-crime-selection__faded')}
            />
          </li>
        </>
      )}
    </ul>
  );
}
