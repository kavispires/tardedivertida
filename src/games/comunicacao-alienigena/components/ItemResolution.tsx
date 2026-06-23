// Icons
import { BoxCheckMarkIcon } from '@icons/BoxCheckMarkIcon';
import { BoxMinusIcon } from '@icons/BoxMinusIcon';
import { BoxOneIcon } from '@icons/BoxOneIcon';
// Components
import { Icon } from '@components/general/Icon';
import { Translate } from '@components/language/Translate';
// Internal
import type { PhaseBasicState } from '../utils/types';
import { ITEM_TYPES } from '../utils/constants';

type ItemResolutionProps = {
  itemId: UID;
  items: PhaseBasicState['items'];
};

export function ItemResolution({ itemId, items }: ItemResolutionProps) {
  const item = items.find((i) => i.id === itemId);

  if (item?.type === ITEM_TYPES.CURSE) {
    return (
      <div>
        <Icon
          icon={<BoxMinusIcon />}
          size="small"
        />{' '}
        <Translate
          pt="Amaldiçoado"
          en="Cursed"
        />
      </div>
    );
  }

  if (item?.type === ITEM_TYPES.ITEM) {
    return (
      <div>
        <Icon
          icon={<BoxCheckMarkIcon />}
          size="small"
        />{' '}
        <Translate
          pt="Correto"
          en="Correct"
        />
      </div>
    );
  }

  return (
    <div>
      <Icon
        icon={<BoxOneIcon />}
        size="small"
      />{' '}
      <Translate
        pt="Irrelevante"
        en="Irrelevant"
      />
    </div>
  );
}
