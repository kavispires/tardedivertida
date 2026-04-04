// Components
import { DualTranslate } from 'components/language/DualTranslate';
// Internal
import type { Track } from '../utils/types';
import { TITLES } from '../utils/constants';

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
