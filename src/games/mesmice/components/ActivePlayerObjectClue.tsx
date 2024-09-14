// Types
import type { GamePlayer } from 'types/player';
// Icons
import { BoxPlusIcon } from 'icons/BoxPlusIcon';
// Components
import { AvatarStrip, IconAvatar } from 'components/avatars';
import { Card } from 'components/cards';
// Internal
import type { ObjectCardObj } from '../utils/types';
import { ObjectCard } from './ObjectCard';

type ActivePlayerObjectClueProps = {
  activePlayer: GamePlayer;
  item: ObjectCardObj;
  clue: string;
};

export function ActivePlayerObjectClue({ activePlayer, item, clue }: ActivePlayerObjectClueProps) {
  return (
    <div className="selections-container__active-player">
      <AvatarStrip player={activePlayer} withName />
      <div className="selections-container__object">
        <ObjectCard item={item} />
        <div>
          <IconAvatar icon={<BoxPlusIcon />} size="small" />
        </div>
        <Card hideHeader>{clue}</Card>
      </div>
    </div>
  );
}
