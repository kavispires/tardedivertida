// Icons
import { CassetteTapeIcon } from '@icons/CassetteTapeIcon';
import { MicrophoneIcon } from '@icons/MicrophoneIcon';
import { TDIcon } from '@icons/TDIcon';
// Components
import { GameBanner } from '@components/game-identity/GameBanner';
// Internal
import type { Track } from '../utils/types';
import { MEGAMIX_TRACKS } from '../utils/constants';
import { SpinningVinylRecordIcon } from './VinylRecordIcon';

type TrackIconProps = {
  track: Track;
};

export const TrackIcon = ({ track }: TrackIconProps) => {
  // Cassette Icon (Choices Tracks)
  if (['megamix-best-of-three', 'megamix-this-that', 'megamix-which-picture'].includes(track.game)) {
    return <CassetteTapeIcon />;
  }

  // Microphone Icon (Party version)
  if (['megamix-who-said-this'].includes(track.game)) {
    return <MicrophoneIcon />;
  }

  // Vinyl Icon (TD Games)
  if (MEGAMIX_TRACKS?.[track.game]) {
    return (
      <SpinningVinylRecordIcon
        cover={
          <GameBanner
            gameName={track.game}
            width={232 * 1.5}
          />
        }
      />
    );
  }

  // All others
  return <TDIcon />;
};
