// Types
import type { PhaseProps } from 'types/game';
// Hooks
import { useCardWidth } from 'hooks/useCardWidth';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { FinalGalleryEntry } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { FinalGalleryItem } from './components/FinalGalleryItem';

export function PhaseGameOver({ state, players }: PhaseProps) {
  const canvasWidth = useCardWidth(8, { gap: 16, minWidth: 100, maxWidth: 500 });

  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<CrownIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <TitledContainer
        title={<Translate pt="Sinais" en="Sings" />}
        contentProps={{ className: 'final-gallery' }}
      >
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
      </TitledContainer>
    </GameOverWrapper>
  );
}
