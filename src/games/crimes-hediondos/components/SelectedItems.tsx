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
  fadeWeapon?: boolean;
  fadeEvidence?: boolean;
};

export function SelectedItems({
  items,
  weaponId,
  evidenceId,
  fadeWeapon = false,
  fadeEvidence = false,
}: SelectedItemsProps) {
  const cardWidth = useCardWidth(12, { gap: 8, minWidth: 50, maxWidth: 200 });

  return (
    <ul className="h-items-crime-selection">
      <li>
        <CrimeItemCard
          item={items[weaponId]}
          cardWidth={cardWidth}
          className={clsx(fadeWeapon && 'h-items-crime-selection__faded')}
        />
      </li>
      <li>
        <PlusSquareFilled style={{ color: 'white' }} />
      </li>
      <li>
        <CrimeItemCard
          item={items[evidenceId]}
          cardWidth={cardWidth}
          className={clsx(fadeEvidence && 'h-items-crime-selection__faded')}
        />
      </li>
    </ul>
  );
}
