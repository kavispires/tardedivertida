// Utils
import { ITEM_TYPES } from '../utils/constants';
// Components
import { BoxCheckMarkIcon } from 'components/icons/BoxCheckMarkIcon';
import { BoxOneIcon } from 'components/icons/BoxOneIcon';
import { BoxXIcon } from 'components/icons/BoxXIcon';
import { IconAvatar } from 'components/icons/IconAvatar';
import { Translate } from 'components/language';

type ItemResolutionProps = {
  itemId: CardId;
  items: Item[];
};

export function ItemResolution({ itemId, items }: ItemResolutionProps) {
  const item = items.find((i) => i.id === itemId);

  if (item?.type === ITEM_TYPES.CURSE) {
    return (
      <div>
        <IconAvatar icon={<BoxXIcon />} size="small" /> <Translate pt="Amaldiçoado" en="Cursed" />
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
      <IconAvatar icon={<BoxOneIcon />} size="small" /> <Translate pt="Indiferente" en="Indifferent" />
    </div>
  );
}
