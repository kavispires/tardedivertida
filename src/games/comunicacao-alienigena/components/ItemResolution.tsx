// Icons
import { BoxCheckMarkIcon } from 'icons/BoxCheckMarkIcon';
import { BoxMinusIcon } from 'icons/BoxMinusIcon';
import { BoxOneIcon } from 'icons/BoxOneIcon';
// Components
import { IconAvatar } from 'components/avatars/IconAvatar';
import { Translate } from 'components/language';
// Internal
import type { PhaseBasicState } from '../utils/types';
import { ITEM_TYPES } from '../utils/constants';

type ItemResolutionProps = {
  itemId: CardId;
  items: PhaseBasicState['items'];
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
