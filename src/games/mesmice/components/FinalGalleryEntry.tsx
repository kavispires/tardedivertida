// Types
import type { GamePlayers } from 'types/game';
// Icons
import { BoxEqualIcon } from '@icons/BoxEqualIcon';
import { BoxPlusIcon } from '@icons/BoxPlusIcon';
// Components
import { TextCard } from '@components/cards/TextCard';
import { Icon } from '@components/general/Icon';
import { PlayerAvatarStrip } from '@components/player/PlayerAvatarStrip';
// Internal
import type { ExtendedObjectFeatureCard, MesmiceGalleryEntry } from '../utils/types';
import { ObjectCard } from './ObjectCard';
import { ObjectFeature } from './ObjectFeature';
import { ScoreTrack } from './ScoreTrack';

type FinalGalleryEntryProps = {
  entry: MesmiceGalleryEntry;
  features: Dictionary<ExtendedObjectFeatureCard>;
  players: GamePlayers;
};

export function FinalGalleryEntry({ entry, features, players }: FinalGalleryEntryProps) {
  return (
    <div className="selections-container__active-player">
      <PlayerAvatarStrip
        player={players[entry.playerId]}
        withName
      />
      <div className="selections-container__object selections-container__content">
        <ObjectCard item={entry.item} />
        <div>
          <Icon
            icon={<BoxPlusIcon />}
            size="small"
          />
        </div>
        <div>
          <TextCard>{entry.clue}</TextCard>
        </div>
        <div>
          <Icon
            icon={<BoxEqualIcon />}
            size="small"
          />
        </div>
        <ObjectFeature
          feature={features[entry.featureId]}
          width={48}
        />
        <ScoreTrack
          history={entry.history}
          hideInstructions
        />
      </div>
    </div>
  );
}
