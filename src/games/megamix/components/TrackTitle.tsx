// Components
import { DualTranslate } from '@components/language/DualTranslate';
// Internal
import type { Track } from '../utils/types';
import { MEGAMIX_TRACKS } from '../utils/constants';

type TrackTitleProps = {
  track: Track;
};

export const TrackTitle = ({ track }: TrackTitleProps) => {
  const text: DualLanguageValue = MEGAMIX_TRACKS?.[track.game]?.title ?? {
    pt: 'Nome do Jogo',
    en: 'Game Title',
  };

  return <DualTranslate>{text}</DualTranslate>;
};
