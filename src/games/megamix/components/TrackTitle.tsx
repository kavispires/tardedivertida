// Type
import type { Track } from '../utils/types';
// Utils
import { TITLES } from '../utils/constants';
// Components
import { DualTranslate } from 'components/language';

type TrackTitleProps = {
  track: Track;
};

export const TrackTitle = ({ track }: TrackTitleProps) => {
  const instruction: DualLanguageValue = TITLES?.[track.game] ?? {
    pt: 'Nome do Jogo',
    en: 'Game Title',
  };

  return <DualTranslate>{instruction}</DualTranslate>;
};
