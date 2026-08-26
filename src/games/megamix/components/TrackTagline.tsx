// Components
import { DualTranslate } from '@components/language/DualTranslate';
// Internal
import type { Track } from '../utils/types';
import { MEGAMIX_TRACKS } from '../utils/constants';

type TrackTaglineProps = {
  track: Track;
};

export const TrackTagline = ({ track }: TrackTaglineProps) => {
  const text: DualLanguageValue = MEGAMIX_TRACKS?.[track.game]?.tagline ?? {
    pt: 'Se vire nos 30!',
    en: 'Do something!',
  };

  return <DualTranslate>{text}</DualTranslate>;
};
