import clsx from 'clsx';
// Ant Design Resources
import { PlusSquareFilled } from '@ant-design/icons';
// Hooks
import { useCardWidth } from 'hooks';
// Components
import { ItemCard } from './ItemCard';

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
  const cardWidth = useCardWidth(12, 8, 50, 200);

  return (
    <ul className="h-items-crime-selection">
      <li>
        <ItemCard
          item={items[weaponId]}
          cardWidth={cardWidth}
          preview
          className={clsx(fadeWeapon && 'h-items-crime-selection__faded')}
        />
      </li>
      <li>
        <PlusSquareFilled style={{ color: 'white' }} />
      </li>
      <li>
        <ItemCard
          item={items[evidenceId]}
          cardWidth={cardWidth}
          preview
          className={clsx(fadeEvidence && 'h-items-crime-selection__faded')}
        />
      </li>
    </ul>
  );
}
