// Types
import type { PhaseProps } from 'types/game';
// Icons
import { TrophyIcon } from 'icons/TrophyIcon';
// Components
import { GameOverWrapper } from 'components/game-over';
import { Achievements } from 'components/general/Achievements';
import { Translate } from 'components/language/Translate';
import { TitledContainer } from 'components/layout/TitledContainer';
// Internal
import { achievementsReference } from './utils/achievements';
import type { PhaseGameOverState } from './utils/types';
import { GalleryEntry } from './components/GalleryEntry';

export function PhaseGameOver({ state, players }: PhaseProps<PhaseGameOverState>) {
  return (
    <GameOverWrapper
      state={state}
      players={players}
      announcementIcon={<TrophyIcon />}
    >
      <Achievements
        players={players}
        achievements={state.achievements}
        reference={achievementsReference}
      />
      <TitledContainer
        title={
          <Translate
            pt="Galeria"
            en="Gallery"
          />
        }
        contentProps={{ className: 'full-width' }}
      >
        {state.gallery.map((entry) => (
          <GalleryEntry
            key={entry.playerId}
            entry={entry}
            players={players}
          />
        ))}
      </TitledContainer>
    </GameOverWrapper>
  );
}
