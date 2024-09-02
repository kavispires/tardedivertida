// Types
import type { Item } from '../utils/types';
// Utils
import { ITEM_TYPES } from '../utils/constants';
// Icons
import { BoxOneIcon } from 'icons/BoxOneIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
// Components
import { Translate } from 'components/language';
import { IconAvatar } from 'components/avatars/IconAvatar';

type ItemResolutionProps = {
  itemId: CardId;
  items: Item[];
};

export function ItemResolution({ itemId, items }: ItemResolutionProps) {
  const item = items.find((i) => i.id === itemId);

  if (item?.type === ITEM_TYPES.CURSE) {
    return (
      <div>
        <IconAvatar icon={<BoxMinusIcon />} size="small" /> <Translate pt="Amaldiçoado" en="Cursed" />
      </div>
    );
  }

  if (item?.type === ITEM_TYPES.ITEM) {
    return (
      <div>
        <IconAvatar icon={<BoxCheckMarkIcon />} size="small" /> <Translate pt="Correto" en="Correct" />
      </div>
    );
  }

  return (
    <div>
      <IconAvatar icon={<BoxOneIcon />} size="small" /> <Translate pt="Irrelevante" en="Irrelevant" />
    </div>
  );
}
