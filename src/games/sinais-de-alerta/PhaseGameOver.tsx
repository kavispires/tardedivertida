// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Container } from 'components/general/Container';
import { Translate } from 'components/language';
// Internal
import type { FinalGalleryEntry } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { FinalGalleryItem } from './components/FinalGalleryItem';

export function PhaseGameOver({ state, info, players }: PhaseProps) {
  const canvasWidth = useCardWidth(8, { gap: 16, minWidth: 100, maxWidth: 500 });

  return (
    <GameOverWrapper info={info} state={state} players={players} announcementIcon={<CrownIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <Container title={<Translate pt="Sinais" en="Sings" />} contentProps={{ className: 'final-gallery' }}>
        {state.gallery.map((entry: FinalGalleryEntry) => {
          return (
            <FinalGalleryItem
              key={`${entry.playerId}-${entry.id}`}
              entry={entry}
              players={players}
              width={canvasWidth}
            />
          );
        })}
      </Container>
    </GameOverWrapper>
  );
}
