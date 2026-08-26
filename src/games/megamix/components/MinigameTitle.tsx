// Components
import { DualTranslate } from '@components/language/DualTranslate';
import { Title } from '@components/text/Title';
// Internal
import { MEGAMIX_TRACKS } from '../utils/constants';
import type { Track } from '../utils/types';

type MinigameTitleProps = {
  track: Track;
  title?: DualLanguageValue;
};

export function MinigameTitle({ track, title }: MinigameTitleProps) {
  const text: DualLanguageValue =
    (title ?? track)
      ? MEGAMIX_TRACKS?.[track.game]?.title
      : {
          pt: 'Nome do Jogo',
          en: 'Game Title',
        };

  return (
    <Title
      size="small"
      level={2}
      className="minigame-title__number"
    >
      <DualTranslate>{text}</DualTranslate>
    </Title>
  );
}
