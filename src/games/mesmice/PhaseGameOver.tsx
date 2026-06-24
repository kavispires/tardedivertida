// Types
import type { PhaseProps } from 'types/game';
// Icons
import { CrownIcon } from '@icons/CrownIcon';
// Components
import { Achievements } from '@components/achievements/Achievements';
import { Translate } from '@components/language/Translate';
import { TitledContainer } from '@components/layout/TitledContainer';
import { GameOverWrapper } from '@components/wrappers/GameOverWrapper';
// Internal
import type { MesmiceGalleryEntry, PhaseGameOverState } from './utils/types';
import { achievementsReference } from './utils/achievements';
import { FinalGalleryEntry } from './components/FinalGalleryEntry';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<CrownIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />

      <TitledContainer
        title={
          <Translate
            pt="Objetos, Dicas e Características"
            en="Objects, Clues and Features"
          />
        }
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
