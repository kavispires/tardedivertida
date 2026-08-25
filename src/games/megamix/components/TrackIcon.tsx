// Icons
import { CassetteTapeIcon } from '@icons/CassetteTapeIcon';
import { MicrophoneIcon } from '@icons/MicrophoneIcon';
import { TDIcon } from '@icons/TDIcon';
// Components
import { GameBanner } from '@components/game-identity/GameBanner';
// Internal
import type { Track } from '../utils/types';
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
  if (
    [
      'arte-ruim',
      'comunicacao-alienigena',
      'contadores-historias',
      'crimes-hediondos',
      'cruza-palavras',
      'detetives-imaginativos',
      'esquiadores',
      'espiao-entre-nos',
      'fileira-de-fatos',
      'galeria-de-sonhos',
      'labirinto-secreto',
      'mente-coletiva',
      'namoro-ou-amizade',
      'na-rua-do-medo',
      'onda-telepatica',
      'palheta-de-cores',
      'polemica-da-vez',
      'porta-dos-desesperados',
      'quem-nao-mata',
      'quem-sou-eu',
      'retrato-falado',
      'super-campeonato',
      'testemunha-ocular',
      'ta-na-cara',
      'ue-so-isso',
      'vamos-ao-cinema',
    ].includes(track.game)
  ) {
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

  // if ()
};
