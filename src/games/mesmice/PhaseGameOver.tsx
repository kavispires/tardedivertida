// Types
import type { PhaseProps } from 'types/game';
// Icons
import { CrownIcon } from 'icons/CrownIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import type { MesmiceGalleryEntry } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { FinalGalleryEntry } from './components/FinalGalleryEntry';

export function PhaseGameOver({ state, players }: PhaseProps) {
  return (
    <GameOverWrapper state={state} players={players} announcementIcon={<CrownIcon />}>
      <Achievements players={players} achievements={state.achievements} reference={achievementsReference} />

      <TitledContainer
        title={<Translate pt="Objetos, Dicas e Características" en="Objects, Clues and Features" />}
        contentProps={{ className: 'final-gallery' }}
      >
        {state.gallery.map((entry: MesmiceGalleryEntry) => {
          return (
            <FinalGalleryEntry
              key={`${entry.playerId}-${entry.item.id}`}
              entry={entry}
              features={state.features}
              players={players}
            />
          );
        })}
      </TitledContainer>
    </GameOverWrapper>
  );
}
