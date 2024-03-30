// Types
import type { ExtendedObjectFeatureCard, MesmiceGalleryEntry } from '../utils/types';
import type { GamePlayers } from 'types/player';
// Icons
import { BoxPlusIcon } from 'icons/BoxPlusIcon';
import { BoxEqualIcon } from 'icons/BoxEqualIcon';
// Components
import { AvatarStrip, IconAvatar } from 'components/avatars';
import { Card } from 'components/cards';
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
      <AvatarStrip player={players[entry.playerId]} withName />
      <div className="selections-container__object selections-container__content">
        <ObjectCard item={entry.item} />
        <div>
          <IconAvatar icon={<BoxPlusIcon />} size="small" />
        </div>
        <div>
          <Card hideHeader>{entry.clue}</Card>
        </div>
        <div>
          <IconAvatar icon={<BoxEqualIcon />} size="small" />
        </div>
        <ObjectFeature feature={features[entry.featureId]} width={48} />
        <ScoreTrack history={entry.history} hideInstructions />
      </div>
    </div>
  );
}
