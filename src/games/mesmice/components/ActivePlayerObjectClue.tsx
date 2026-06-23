// Types
import type { GamePlayer } from 'types/game';
// Icons
import { BoxPlusIcon } from '@icons/BoxPlusIcon';
// Components
import { Card } from '@components/cards/Card';
import { Icon } from '@components/general/Icon';
import { PlayerAvatarStrip } from '@components/player/PlayerAvatarStrip';
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
      <PlayerAvatarStrip
        player={activePlayer}
        withName
      />
      <div className="selections-container__object">
        <ObjectCard item={item} />
        <div>
          <Icon
            icon={<BoxPlusIcon />}
            size="small"
          />
        </div>
        <Card hideHeader>{clue}</Card>
      </div>
    </div>
  );
}
